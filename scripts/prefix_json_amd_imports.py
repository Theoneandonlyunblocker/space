import os
import re

def processFile(inFile, fileName):
  rewrittenLines = []
  hasMatch = False

  inFile.seek(0, 0)
  for line in inFile:
    replacedLine = line

    if '"./moduleInfo.json' in line:
      replacedLine = line.replace("./moduleInfo.json", "json!./moduleInfo.json")
      hasMatch = True

    rewrittenLines.append(replacedLine)

  return (hasMatch, rewrittenLines)

matchesFound = 0

for root, dirs, files in os.walk("./dist/modules/", topdown=False):
  for fileName in files:
    if fileName.endswith(".js"):
      hasMatch = False
      with open(os.path.join(root, fileName), "r") as inFile:
        hasMatch, reWrittenLines = processFile(inFile, fileName)
      if hasMatch:
        matchesFound += 1
        with open(os.path.join(root, fileName), "w") as outFile:
          for line in reWrittenLines:
            outFile.write(line)

print("Prefixed JSON import in {} files\n".format(matchesFound))

