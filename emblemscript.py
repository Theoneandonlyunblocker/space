import os
import re

os.chdir("img/emblems")

result = open("emblems", "w")

def makeEmblemTemplate(name):
  encoded = re.sub(r'\W+', '', name)
  emblemTemplate = (
    'export var ' + encoded + ': Rance.Templates.ISubEmblemTemplate =\n'
    '{\n'
    '  key: "' + encoded + '",\n'
    '  src: "' + name + '.svg",\n'
    '  coverage: [SubEmblemCoverage.both],\n'
    '  position: [SubEmblemPosition.both]\n'
    '}\n'
  )

  return emblemTemplate;


for filename in os.listdir("."):
  if filename.endswith(".svg"):
    result.write(makeEmblemTemplate(filename[:-4]))

result.close()
