I installed native wind and tailwind.css with the following commands
npm install nativewind
npm install --save-dev tailwindcss@3.3.2

after which i run 'npx taiwindcss init'
make sure to follow the docs proper to see full set up guide
https://www.nativewind.dev/quick-starts/expo

fo typeScpit i had to create the file 'nativewind-env.d.ts' before i could have a noce auto-completion feature

I did'nt use the normal expo-three as it was having 'peer dependency issues' so I used
npm install three @react-three/fiber @react-three/drei
