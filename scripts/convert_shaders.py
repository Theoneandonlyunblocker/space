#!/usr/bin/env python3

# Assumes uniform types are in typeScriptTypes dict
# Assumes uniforms not in pixiUniforms array should be included
# Assumes no block comments
# if #define DOMAIN, ignores uniforms declared inside block not matching defined DOMAIN

import os
import sys
import re
from pathlib import PurePath

fileNamesToConvert = sys.argv[1:]
hasSpecifiedFileNames = len(fileNamesToConvert) > 0

# TODO naive
typeScriptTypes = {
  "bool": "boolean",
  "int": "number",
  "float": "number",
  "vec2": "number[]",
  "vec3": "number[]",
  "vec4": "number[]",
  "ivec2": "number[]",
  "ivec3": "number[]",
  "ivec4": "number[]",
  "mat2": "number[][]",
  "mat3": "number[][]",
  "mat4": "number[][]",
  "sampler2D": "PIXI.Texture"
}
pixiTypes = {
  "bool": "bool",
  "int": "int",
  "float": "float",
  "vec2": "vec2",
  "vec3": "vec3",
  "vec4": "vec4",
  "ivec2": "ivec2",
  "ivec3": "ivec3",
  "ivec4": "ivec4",
  "mat2": "mat2",
  "mat3": "mat3",
  "mat4": "mat4",
  "sampler2D": "sampler2D"
}

pixiUniforms = [
  "vTextureCoord",
  "uSampler"
]

uniformKeyword = "uniform "
keyWordPattern = re.compile("\w+")
domainPattern = re.compile("\d")

def getRelativePixiPath(shaderPath):
  return os.path.relpath("lib/pixi.d.ts", shaderPath).replace("\\", "/")

def getGLSLUniformTypes(sourceLines):
  uniformTypes = {}
  currentDomain = None
  currentDomainBlock = None

  for line in sourceLines:
    if "#define DOMAIN" in line: # TODO naive
      currentDomain = re.search(domainPattern, line).group(0)
    elif "DOMAIN ==" in line:
      currentDomainBlock = re.search(domainPattern, line).group(0)
    elif currentDomainBlock is not None and "#endif" in line:
      currentDomainBlock = None

    if currentDomainBlock is not None and currentDomainBlock is not currentDomain:
      continue

    keyWordIndex = line.find(uniformKeyword)
    if keyWordIndex != -1:
      isCommented = line.find("//", 0, keyWordIndex) # TODO naive
      if isCommented != -1:
        continue
      splitted = line.strip().split(" ")
      glslType = splitted[1]
      uniformName = re.search(keyWordPattern, splitted[2]).group(0)
      if uniformName in pixiUniforms:
        continue

      uniformTypes[uniformName] = glslType

  return uniformTypes

def getUniformsLines(uniformTypes):
  lines = [
    'interface Uniforms\n',
    '{\n'
  ]

  for uniformName in sorted(uniformTypes):
    glslType = uniformTypes[uniformName]
    pixiType = pixiTypes[glslType]
    typeScriptType = typeScriptTypes[glslType]
    lines.append('  {0}: {{type: "{1}"; value: {2};}};\n'.format(uniformName, pixiType, typeScriptType))

  lines.append('}\n\n')

  lines.extend([
    'interface PartialUniformValues\n',
    '{\n'
  ])

  for uniformName in sorted(uniformTypes):
    glslType = uniformTypes[uniformName]
    typeScriptType = typeScriptTypes[glslType]
    lines.append('  {0}?: {1};\n'.format(uniformName, typeScriptType))

  lines.append('}\n\n')
  return lines

def getGetUniformsObjectLines(uniformTypes, indentationLevel):

  lines = [
    'private static makeUniformsObject(initialValues: PartialUniformValues = {}): Uniforms\n',
    '{\n',
    '  return(\n',
    '  {\n'
  ]

  for uniformName in sorted(uniformTypes):
    glslType = uniformTypes[uniformName]
    pixiType = pixiTypes[glslType]
    lines.append('    {0}: {{type: "{1}", value: initialValues.{0}}},\n'.format(uniformName, pixiType))

  lines.extend([
    '  });\n',
    '}\n'
  ])

  return ["  " * indentationLevel + line for line in lines]

def getSetUniformValuesLines(indentationLevel):
  lines = [
    'public setUniformValues(values: PartialUniformValues)\n',
    '{\n',
    '  for (let key in values)\n',
    '  {\n',
    '    this.uniforms[key] = values[key];\n',
    '  }\n',
    '}\n'
  ]

  return ["  " * indentationLevel + line for line in lines]

def writeConvertedShader(outFile, sourceLines, shaderName, fileName, rootDir):
  relativePixiPath = getRelativePixiPath(rootDir)
  outFile.writelines([
    '// Autogenerated from "./{0}"\n\n'.format(fileName),
    '/// <reference path="{0}"/>\n\n'.format(relativePixiPath)
  ])

  glslUniformTypes = getGLSLUniformTypes(sourceLines)
  uniformsLines = getUniformsLines(glslUniformTypes)
  for line in uniformsLines:
    outFile.write(line)

  outFile.writelines([
    'export default class {0} extends PIXI.Filter\n'.format(shaderName),
    '{\n',
    # TODO 02.11.2016 | can't we make this protected?
    '  public uniforms: Uniforms // needs to be public for PIXI, but shouldnt be accessed\n\n',
    '  constructor(initialUniformValues?: PartialUniformValues)\n',
    '  {\n',
    '    const uniforms = {0}.makeUniformsObject(initialUniformValues);\n'.format(shaderName),
    '    super(null, sourceLines.join("\\n"), uniforms);\n',
    '  }\n'
  ])

  getUniformTypesLines = getGetUniformsObjectLines(glslUniformTypes, 1)
  for line in getUniformTypesLines:
    outFile.write(line)

  setUniformValuesLines = getSetUniformValuesLines(1)
  for line in setUniformValuesLines:
    outFile.write(line)

  outFile.writelines([
    '}\n',
    '\n',
    'const sourceLines =\n',
    '[\n'
  ])

  for line in sourceLines:
    outFile.write('  "{0}",\n'.format(line.rstrip()))

  outFile.write(
    ']\n'
  )

for root, dirs, files in os.walk(".", topdown=False):
  for fileName in files:
    if fileName.endswith(".glsl") or fileName.endswith(".frag"):
      if hasSpecifiedFileNames and fileName not in fileNamesToConvert:
        continue
      shaderName = fileName[:-5]
      sourceLines = []
      with open(os.path.join(root, fileName), "r") as inFile:
        sourceLines = inFile.readlines()
      with open(os.path.join(root, "{0}.ts".format(shaderName)), "w") as outFile:
        writeConvertedShader(outFile, sourceLines, shaderName, fileName, root)
