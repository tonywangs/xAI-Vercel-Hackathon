import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('idImage') as File;
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Save uploaded file to temporary location
    const tempDir = tmpdir();
    const tempFilePath = join(tempDir, `id_${Date.now()}.jpg`);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(tempFilePath, buffer);

    // Call Python script to process the ID
    const processScriptPath = join(process.cwd(), '../process.py');
    console.log('Python script path:', processScriptPath);
    console.log('Temp file path:', tempFilePath);
    
    const pythonProcess = spawn('python3', [processScriptPath, tempFilePath], {
      env: { ...process.env, XAI_API_KEY: process.env.XAI_API_KEY }
    });

    let output = '';
    let error = '';

    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      error += data.toString();
    });

    return new Promise((resolve) => {
      pythonProcess.on('close', async (code) => {
        // Clean up temporary file
        try {
          await unlink(tempFilePath);
        } catch (e) {
          console.error('Error deleting temp file:', e);
        }

        if (code !== 0) {
          console.error('Python process error:', error);
          resolve(NextResponse.json(
            { success: false, error: 'Failed to process ID image' },
            { status: 500 }
          ));
          return;
        }

        try {
          // Parse the JSON output from Python script
          console.log('Python output:', output);
          console.log('Python error:', error);
          
          // Extract JSON from the output - look for the JSON object between the first { and last }
          const startIndex = output.indexOf('{');
          const lastIndex = output.lastIndexOf('}');
          
          if (startIndex === -1 || lastIndex === -1 || startIndex >= lastIndex) {
            throw new Error('No JSON found in Python output');
          }
          
          const jsonString = output.substring(startIndex, lastIndex + 1);
          console.log('Extracted JSON string:', jsonString);
          
          const result = JSON.parse(jsonString);
          
          // Calculate age from birthday if available
          let age = undefined;
          if (result.birthday && result.birthday !== 'Not Found') {
            const birthDate = new Date(result.birthday);
            const today = new Date();
            age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
              age--;
            }
          }

          resolve(NextResponse.json({
            success: true,
            data: {
              firstName: result.first_name,
              lastName: result.last_name,
              fullName: result.first_name && result.last_name ? `${result.first_name} ${result.last_name}` : undefined,
              gender: result.gender,
              birthday: result.birthday,
              age: age
            }
          }));
        } catch (parseError) {
          console.error('Error parsing Python output:', parseError);
          resolve(NextResponse.json(
            { success: false, error: 'Failed to parse ID processing result' },
            { status: 500 }
          ));
        }
      });
    });

  } catch (error) {
    console.error('ID processing error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
