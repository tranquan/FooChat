# There're two config: 'dev', 'prod', specify by the CONFIGS_FILE in app/constants/configs.js
# This file help to change these values below according to config
# - CFBundleDisplayName (aka App Name)
# - BundleID
# - Provisioning Profile
# - Firebase Plist file


import os
import glob
import re
from shutil import copyfile

# Contants

CURRENT_PATH = os.path.dirname(os.path.abspath(__file__))
CONFIGS_FILE = "../app/constants/configs.js"

IOS_INFO_FILE = "../ios/Digitel/Info.plist"
IOS_PROJECT_FILE = "../ios/Digitel.xcodeproj/project.pbxproj"
IOS_FIREBASE_FILE = '../ios/Digitel/GoogleService-Info.plist'

# App Name

DEV_APP_NAME = "Appay(DEV)"
PROD_APP_NAME = "Appay"

# Firebase files

DEV_FIREBASE_FILE = "../ios/Digitel/GoogleService-Info-Dev.plist"
PROD_FIREBASE_FILE = "../ios/Digitel/GoogleService-Info-Prod.plist"

# Provisioning Profiles info need to be change it was re-generate

DEV_PRODUCT_BUNDLE_IDENTIFIER = "com.digitel.appaydev"
DEV_PROVISIONING_PROFILE_DEBUG = "\"5546a246-1b06-4328-8ef1-042bb4038baa\""
DEV_PROVISIONING_PROFILE_SPECIFIER_DEBUG = "\"AppayDev Dev\""
DEV_PROVISIONING_PROFILE_RELEASE = "\"4ba66f3e-da29-45ce-8365-2a34783a43d3\""
DEV_PROVISIONING_PROFILE_SPECIFIER_RELEASE = "\"AppayDev AhHoc\""

PROD_PRODUCT_BUNDLE_IDENTIFIER = "com.digitel.appay"
PROD_PROVISIONING_PROFILE_DEBUG = "\"013cc61a-df76-44b8-ab56-b31d8a6ad59e\""
PROD_PROVISIONING_PROFILE_SPECIFIER_DEBUG = "\"Appay Dev\""
PROD_PROVISIONING_PROFILE_RELEASE = "\"9f06b168-40f7-46a3-971c-1f0a5cffac0b\""
PROD_PROVISIONING_PROFILE_SPECIFIER_RELEASE = "\"Appay AppStore\""


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
    return content

  key_end_index = content.find(key_end, key_begin_index)
  if key_end_index < 0:
    return content

  newContent = content[0:key_begin_index] + value + content[key_end_index:]
  return newContent


# config ios info plist
# config bundle display name to appropriate env
def config_ios_info_file(env):

  filein = open(CURRENT_PATH + '/' + IOS_INFO_FILE, 'r')
  content = filein.read()
  filein.close()

  app_name_begin_index = content.find("<key>CFBundleDisplayName</key>")
  if app_name_begin_index < 0:
    exit(0)

  app_name = PROD_APP_NAME if env == 'prod' else DEV_APP_NAME
  relace_value = "<string>" + app_name
  content = replace_value_in_content(content, app_name_begin_index, "<string>", "</string>", relace_value)

  # overwrite file
  fileout = open(CURRENT_PATH + '/' + IOS_INFO_FILE, 'w+')
  fileout.write(content)
  fileout.close()



# config ios project file
# config bundleID, provisioning profile to appropriate env
def config_ios_project_file(env):

  # read file content
  filein = open(CURRENT_PATH + '/' + IOS_PROJECT_FILE, 'r')
  content = filein.read()
  filein.close()

  # config DEBUG
  debug_begin = content.find("/* Debug */ = {")
  if debug_begin < 0:
    return

  bundle_id = PROD_PRODUCT_BUNDLE_IDENTIFIER if env == 'prod' else DEV_PRODUCT_BUNDLE_IDENTIFIER
  relace_value = "PRODUCT_BUNDLE_IDENTIFIER = " + bundle_id + ";"
  content = replace_value_in_content(content, debug_begin, "PRODUCT_BUNDLE_IDENTIFIER", "\n", relace_value)

  provisioning_profile = PROD_PROVISIONING_PROFILE_DEBUG if env == 'prod' else DEV_PROVISIONING_PROFILE_DEBUG
  relace_value = "PROVISIONING_PROFILE = " + provisioning_profile + ";"
  content = replace_value_in_content(content, debug_begin, "PROVISIONING_PROFILE", "\n", relace_value)

  provisioning_profile_spec = PROD_PROVISIONING_PROFILE_SPECIFIER_DEBUG if env == 'prod' else DEV_PROVISIONING_PROFILE_SPECIFIER_DEBUG
  relace_value = "PROVISIONING_PROFILE_SPECIFIER = " + provisioning_profile_spec + ";"
  content = replace_value_in_content(content, debug_begin, "PROVISIONING_PROFILE_SPECIFIER", "\n", relace_value)

  # config RELEASE
  release_begin = content.find("/* Release */ = {")
  if release_begin < 0:
    return

  bundle_id = PROD_PRODUCT_BUNDLE_IDENTIFIER if env == 'prod' else DEV_PRODUCT_BUNDLE_IDENTIFIER
  relace_value = "PRODUCT_BUNDLE_IDENTIFIER = " + bundle_id + ";"
  content = replace_value_in_content(content, release_begin, "PRODUCT_BUNDLE_IDENTIFIER", "\n", relace_value)

  provisioning_profile = PROD_PROVISIONING_PROFILE_RELEASE if env == 'prod' else DEV_PROVISIONING_PROFILE_RELEASE
  relace_value = "PROVISIONING_PROFILE = " + provisioning_profile + ";"
  content = replace_value_in_content(content, release_begin, "PROVISIONING_PROFILE", "\n", relace_value)

  provisioning_profile_spec = PROD_PROVISIONING_PROFILE_SPECIFIER_RELEASE if env == 'prod' else DEV_PROVISIONING_PROFILE_SPECIFIER_RELEASE
  relace_value = "PROVISIONING_PROFILE_SPECIFIER = " + provisioning_profile_spec + ";"
  content = replace_value_in_content(content, release_begin, "PROVISIONING_PROFILE_SPECIFIER", "\n", relace_value)

  # overwrite file
  fileout = open(CURRENT_PATH + '/' + IOS_PROJECT_FILE, 'w+')
  fileout.write(content)
  fileout.close()

  # print content
  return


# config firebase service file
# config the firebase plist file to appropriate env
def config_ios_firebase(env):

  firebase_plist_source_file = ''
  firebase_plist_dest_file =  CURRENT_PATH + '/' + IOS_FIREBASE_FILE

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

config_ios_info_file(env)

config_ios_project_file(env)

config_ios_firebase(env)

