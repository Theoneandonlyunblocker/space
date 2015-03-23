import os

os.chdir("img/emblems")

i = 0
result = open("emblems", "a")

def makeEmblemTemplate(name):
  emblemTemplate = (
    'export var ' + name + ' =\n'
    '{\n'
    '  type: ' + name + ',\n'
    '  position: "both",\n'
    '  foregroundOnly: true,\n'
    '  imageSrc: "' + name + '.png"\n'
    '}\n'
  )

  return emblemTemplate;


for filename in os.listdir("."):
  if filename.endswith(".png"):
    # newName = "emblem" + str(i)
    # os.rename(filename, newName + ".png")
    result.write(makeEmblemTemplate(filename[:-4]))

result.close()
