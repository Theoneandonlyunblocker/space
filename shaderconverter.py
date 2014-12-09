import os

os.chdir("src/shaders")

if not os.path.exists("converted"):
  os.makedirs("converted")

def convertShader(file, filename):

  converted = open(os.path.join("converted", filename), "w")

  converted.write("[\n")
  for line in file:
    converted.write('  "' + line.rstrip() + '",\n')
  converted.write("]\n")

  converted.close();


for filename in os.listdir("."):
  if filename.endswith(".glsl"):
    with open(filename, "r") as file:
      convertShader(file, filename)
