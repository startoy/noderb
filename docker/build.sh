#!/bin/bash

VERSION=${1};

usage() {
        echo
        echo -e " Usage: "$(basename ${0})" <version>";
        echo -e "  ex. <version> = 19.01.DB.01"
        echo
}

export_docker_image() {
  echo
  echo "export docker image.."
  echo "find image fwg/nodejs-api:$VERSION"
  echo "saving image to file name nodejs-api_$VERSION.tar ..."
  docker save -o nodejs-api_$VERSION.tar fwg/nodejs-api:$VERSION
  echo -e "export processing completed.."
  date
  ls -lrt
  du -msh *
}

remove_unness() {
  chmod +x node_adm.sh
  rm Dockerfile
}

export_version() {
  echo "export version name to file image_version.cnf"
  echo "$VERSION > image_version.cnf"
  echo $VERSION > image_version.cnf
}

build() {
  echo 'Build with Version: ['$VERSION']';
  echo 'Finding Dockerfile '$(pwd)/full;
  ls -la $(pwd)/full

# TODO -> check if Dockerfile exist

  cp $(pwd)/full/Dockerfile $(pwd)/../
  ls -la $(pwd)/../

  cd $(pwd)/../
  docker build -t fwg/nodejs-api:$VERSION .

  cd -

  docker images
  docker ps -a
}

if [ -z "$VERSION" ]
then
  usage
else 
  build
  export_docker_image
  cd ../
  remove_unness
  export_version
fi