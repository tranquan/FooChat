# configure app name (in strings.xml) & firebase info google-services.json
# to match with the environment setting in app/constants/configs.js
# *** developer still have to config the applicationId manually ***

import os
import glob
import re
from shutil import copyfile

# Contants

CURRENT_PATH = os.path.dirname(os.path.abspath(__file__))
CONFIGS_FILE = "../app/constants/configs.js"

ANDROID_STRINGS_FILE = "../android/app/src/main/res/values/strings.xml"
ANDROID_GRADLE_FILE = "../android/app/build.gradle"
ANDROID_FIREBASE_FILE = '../android/app/google-services.json'

# App Name

DEV_APP_NAME = "Appay(DEV)"
PROD_APP_NAME = "Appay"

# Application Id

DEV_APPLICATION_ID = "\"com.digipay.appaydev\""
PROD_APPLICATION_ID = "\"com.digipay.appay\""

# Firebase

DEV_FIREBASE_FILE = "../android/app/google-services-dev.json"
PROD_FIREBASE_FILE = "../android/app/google-services-prod.json"


# --------------------------------------------------
# HELPER FUNCTIONS
# --------------------------------------------------

## read config file and get environment whether is 'dev' or 'prod'
def get_environment_config():
  
  environment = "dev"
  filein = open(CURRENT_PATH + '/' + CONFIGS_FILE, 'r')
  content = filein.read()
  filein.close()

  env_begin = content.find("export const environment")
  if env_begin < 0:
    exit(0)

  env_equal_sign = content.find("=", env_begin + len("export const environment")) 
  if env_equal_sign < 0:
    exit(0)

  env_end = content.find(";", env_equal_sign + len("="))
  if env_end < 0:
    exit(0)

  env = content[env_equal_sign + 1 : env_end].strip()
  if env == "'DEV'":
    environment = "dev"
  else:
    environment = "prod"

  # print environment
  return environment


# replace the text in content from key_begin t0 key_end with the value
# return the new content = [0:key_begin] + value + [key_end:]
def replace_value_in_content(content, search_from_index, key_begin, key_end, value):
  
  key_begin_index = content.find(key_begin, search_from_index)
  if key_begin_index < 0:
    # print "not found key_begin"
    return content

  key_end_index = content.find(key_end, key_begin_index)
  if key_end_index < 0:
    # print "not found key_end"
    return content

  newContent = content[0:key_begin_index] + value + content[key_end_index:]
  return newContent


# config app strings.xml
# - app_name
#
def config_android_strings_file(env):
  
  filein = open(CURRENT_PATH + '/' + ANDROID_STRINGS_FILE, 'r')
  content = filein.read()
  filein.close()

  app_name = PROD_APP_NAME if env == 'prod' else DEV_APP_NAME
  relace_value = "<string name=\"app_name\">" + app_name
  content = replace_value_in_content(content, 0, "<string name=\"app_name\">", "</string>", relace_value)


  # re-write info file with new content
  # print content
  fileout = open(CURRENT_PATH + '/' + ANDROID_STRINGS_FILE, 'w+')
  fileout.write(content)
  fileout.close()


# config android app build.gradle file
# - applicationId
#
def config_android_gradle_file(env):

  filein = open(CURRENT_PATH + '/' + ANDROID_GRADLE_FILE, 'r')
  content = filein.read()
  filein.close()

  application_id = PROD_APPLICATION_ID if env == 'prod' else DEV_APPLICATION_ID
  relace_value = "applicationId " + application_id
  content = replace_value_in_content(content, 0, "applicationId ", "\n", relace_value)


  # re-write info file with new content
  # print content
  fileout = open(CURRENT_PATH + '/' + ANDROID_GRADLE_FILE, 'w+')
  fileout.write(content)
  fileout.close()


# config firebase service plist file
# - google-services.json
#
def config_android_firebase(env):

  firebase_plist_source_file = ''
  firebase_plist_dest_file =  CURRENT_PATH + '/' + ANDROID_FIREBASE_FILE

  if env == "dev":
    firebase_plist_source_file = CURRENT_PATH + '/' + DEV_FIREBASE_FILE
  else:
    firebase_plist_source_file = CURRENT_PATH + '/' + PROD_FIREBASE_FILE

  if len(firebase_plist_source_file) > 0:
    copyfile(firebase_plist_source_file, firebase_plist_dest_file)
  

# --------------------------------------------------
# MAIN
# --------------------------------------------------

env = get_environment_config()

config_android_strings_file(env)

config_android_gradle_file(env)

config_android_firebase(env)
  