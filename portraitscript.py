import os
import re

os.chdir("img/portraits")

result = open("portraits", "w")

def makeEmblemTemplate(name):
  filenameWithoutExtension = name[:name.rfind(".")]
  encoded = re.sub(r'\W+', '', filenameWithoutExtension)
  emblemTemplate = (
    'export var ' + encoded + ': Rance.Templates.IPortraitTemplate =\n'
    '{\n'
    '  key: "' + encoded + '",\n'
    '  imageSrc: "img\/portraits\/' + name + '",\n'
    '  generatedFor:\n'
    '  [\n'
    '    Templates.RandomGenUnitRarity.common,\n'
    '    Templates.RandomGenUnitRarity.elite,\n'
    '    Templates.RandomGenUnitRarity.commander\n'
    '  ]\n'
    '}\n'
  )

  return emblemTemplate;


for filename in os.listdir("."):
  if not filename.endswith(".license"):
    result.write(makeEmblemTemplate(filename))

result.close()
