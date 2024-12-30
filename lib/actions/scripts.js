'use server'

import prisma from "@prisma/prisma";
import fs from 'fs';
import path from 'path';


export const script = async () => {
    try {
      // Read your JSON file
      const dataPath = path.join(process.cwd(), '/lib/actions/Place.json'); // Adjust the path
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  
      // Assuming your data is an array of objects
      for (const item of data) {
        await prisma.place.create({
          data: item,
        });
      }
      console.log('Data imported successfully');
    } catch (error) {
      console.error('Error importing data:', error);
    }
  }