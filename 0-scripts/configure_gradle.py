# help to config node_modules in react native to a same build configs
# the code will loop through every module defie in MODULES and try to modify the build.gradle file
# @copyright tranquan221b@gmail.com

import os
import glob
import re

# ----------------------------------------------------------------------
# FUNCTIONS:
# ----------------------------------------------------------------------

# read file helper
def readLinesFromFile(filePath):
  try:
    print 'read file: ' + filePath + '\n'
    fin = open(filePath, mode='r')
    lines = fin.readlines()
    fin.close()
    return lines;
  except:
    print 'read file exception: ' + filePath + '\n'
    return None;

# write file helper
def writeContentToFile(filePath, fileContent):
  try:
    print 'write file: ' + filePath + '\n'
    fout = open(filePath, mode='w+')
    fout.write(fileContent)
    fout.close()
  except:
    print 'write file exception: ' + filePath + '\n'
    return None;

# modify gradlew config file
def configure(
  gradlefile, 
  compileSdkVersion = None, buildToolsVersion = None, 
  minSdkVersion = None, targetSdkVersion = None
):
  # read file
  # ----------------------------------------------------------------------
  lines = readLinesFromFile(gradlefile);
  if (lines == None):
    return

  # replace configs
  # ----------------------------------------------------------------------
  newLines = []
  for line in lines:
    
    if line.find('compileSdkVersion') != -1 and compileSdkVersion != None:
      # newLines.append('  compileSdkVersion 26\n')
      newLine = re.sub('compileSdkVersion .*', 'compileSdkVersion ' + str(compileSdkVersion), line)
      newLines.append(newLine)
    
    elif line.find('buildToolsVersion') != -1 and buildToolsVersion != None:
      # newLines.append('  buildToolsVersion \"26.0.3\"\n')
      newLine = re.sub('buildToolsVersion .*', 'buildToolsVersion \"' + str(buildToolsVersion) + "\"", line)
      newLines.append(newLine)
    
    elif line.find('minSdkVersion') != -1 and minSdkVersion != None:
      # newLines.append('    minSdkVersion 19\n')
      newLine = re.sub('minSdkVersion .*', 'minSdkVersion ' + str(minSdkVersion), line)
      newLines.append(newLine)
    
    elif line.find('targetSdkVersion') != -1 and targetSdkVersion != None:
      # newLines.append('    targetSdkVersion 26\n')
      newLine = re.sub('targetSdkVersion .*', 'targetSdkVersion ' + str(targetSdkVersion), line)
      newLines.append(newLine)
    
    else:
      newLines.append(line)
    
  # write file
  # ----------------------------------------------------------------------
  newContent = ''.join(str(x) for x in newLines)
  writeContentToFile(gradlefile, newContent)


# ----------------------------------------------------------------------
# MAIN
#----------------------------------------------------------------------

# defaults, don't change this
COMPILE_SDK_VERSION = None
BUILD_TOOLS_VERSION = None
MIN_SDK_VERSION = None
TARGET_SDK_VERSION = None

# configs:
#----------------------------------------------------------------------
# 1. choose the relative path from this script to your root project
# for i.e :
#   if you put this script at your root project ./configure.py => '/'
#   if you put this script at ./scripts/configure.py => '/../
RELATIVE_PATH = '/../'

# 2. choose values
# comment the config you don't want to override
COMPILE_SDK_VERSION = 26
BUILD_TOOLS_VERSION = "26.0.3"
MIN_SDK_VERSION = 19
TARGET_SDK_VERSION = 20

# 3. choose modules
MODULES = [
  'realm',
	'react-native-contacts',
  'react-native-device-info',
	'react-native-fetch-blob',
	'react-native-firebase'
]

# loop through node_modules and override
#----------------------------------------------------------------------
current_dir = os.path.dirname(os.path.abspath(__file__))
for module in MODULES:
  gradle_file = current_dir + RELATIVE_PATH + 'node_modules/' + module + '/android/build.gradle'
  configure(gradle_file, 
    COMPILE_SDK_VERSION, 
    BUILD_TOOLS_VERSION, 
    MIN_SDK_VERSION, 
    TARGET_SDK_VERSION
  )
