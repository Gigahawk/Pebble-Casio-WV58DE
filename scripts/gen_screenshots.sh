#!/bin/bash

realpath() {
       python -c "import os,sys;print(os.path.realpath(sys.argv[1]))" "$1"
}

SCRIPT=`which pebble`
BIN_PATH=`dirname $SCRIPT`
PEBBLE_PATH=`realpath $BIN_PATH/../`

export PEBBLE_TOOLCHAIN_PATH="$PEBBLE_PATH/arm-cs-tools/bin"
export PATH="$BIN_PATH:$PATH"
export PYTHONHOME="$PEBBLE_PATH/.env/"

# The pebble script doesn't include this, not sure how it works
export PYTHONPATH="$PEBBLE_PATH/pebble-tool"


export PHONESIM_PATH="$PYTHONHOME/bin/pypkjs"



targetPlatforms=$(jq '.pebble.targetPlatforms[]' --raw-output package.json)
python --version
python scripts/gen_message.py

for platform in $targetPlatforms
do
    screenshotPath="build/$platform.png"
    echo "Generating screenshot for $platform"
    "$PEBBLE_PATH/.env/bin/python" scripts/start_emulator.py $platform
    QEMU_PORT=$(cat .qemu_port)
    echo "PORT $QEMU_PORT"
    QEMU_PID=$(cat .qemu_pid)
    echo "PID $QEMU_PID"
    echo "Installing app on $platform"
    pebble install --qemu localhost:$QEMU_PORT
    echo "Sending default settings to app on $platform"
    "$PEBBLE_PATH/.env/bin/python" scripts/send_message.py setup_sample.json $QEMU_PORT
    echo "Sending weather data to app on $platform"
    "$PEBBLE_PATH/.env/bin/python" scripts/send_message.py weather_sample.json $QEMU_PORT
    echo "Saving screenshot to $screenshotPath"
    pebble screenshot --qemu localhost:$QEMU_PORT $screenshotPath
    echo "Killing emulator for $platform"
    kill -9 $QEMU_PID
done





#qemu-pebble \
#    -rtc base=localtime \
#    -serial null \
#    -serial tcp::43143,server,nowait \
#    -serial tcp::50845,server \
#    -pflash /home/jasper/.pebble-sdk/SDKs/4.3/sdk-core/pebble/aplite/qemu/qemu_micro_flash.bin \
#    -gdb tcp::49961,server,nowait \
#    -machine pebble-bb2 \
#    -cpu cortex-m3 \
#    -mtdblock /home/jasper/.pebble-sdk/4.3/aplite/qemu_spi_flash.bin
#
#qemu-pebble \
#    -nographic \
#    -rtc base=localtime \
#    -serial null \
#    -serial tcp::43143,server,nowait \
#    -pflash /home/jasper/.pebble-sdk/SDKs/4.3/sdk-core/pebble/aplite/qemu/qemu_micro_flash.bin \
#    -gdb tcp::49961,server,nowait \
#    -machine pebble-bb2 \
#    -cpu cortex-m3 \
#    -mtdblock /home/jasper/.pebble-sdk/4.3/aplite/qemu_spi_flash.bin
#
#qemu-pebble \
#    -rtc base=utc \
#    -serial null \
#    -serial tcp::43143,server,nowait \
#    -pflash /home/jasper/.pebble-sdk/SDKs/4.3/sdk-core/pebble/aplite/qemu/qemu_micro_flash.bin \
#    -gdb tcp::49961,server,nowait \
#    -machine pebble-bb2 \
#    -cpu cortex-m3 \
#    -mtdblock /home/jasper/.pebble-sdk/4.3/aplite/qemu_spi_flash.bin