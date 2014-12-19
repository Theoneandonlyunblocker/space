import os

def convertShader(file, filename):
  converted.write("      export var " + filename[:-5] + " =\n");
  converted.write("      [\n")
  for line in file:
    converted.write('        "' + line.rstrip() + '",\n')
  converted.write("      ]\n")


os.chdir("src/shaders")

if not os.path.exists("converted"):
  os.makedirs("converted")

converted = open(os.path.join("converted", "shadersources.ts"), "w")

converted.write(
"module Rance\n"
"{\n"
"  export module ShaderSources\n"
"  {\n"
)

for filename in os.listdir("."):
  if filename.endswith(".glsl"):
    with open(filename, "r") as file:
      convertShader(file, filename)

converted.write(
"    \n"
"  }\n"
"}\n"
)

converted.close();
