import bz2
import time
import subprocess
import errno
import argparse
import socket
import os

from libpebble2.communication import PebbleConnection
from libpebble2.protocol.system import TimeMessage, SetUTC
from pebble_tool.sdk import sdk_path, sdk_manager, get_sdk_persist_dir
from pebble_tool.commands.base import PebbleTransportQemu

def _choose_port():
    sock = socket.socket()
    sock.bind(('', 0))
    port = sock.getsockname()[1]
    sock.close()
    return port

def _copy_spi_image(path, platform):
    sdk_qemu_spi_flash = os.path.join(
        sdk_path(), 'pebble', platform, 'qemu', 'qemu_spi_flash.bin.bz2')
    if not os.path.exists(sdk_qemu_spi_flash):
        raise ValueError("Your SDK does not support the Pebble Emulator.")
    else:
        try:
            os.makedirs(os.path.dirname(path))
        except OSError as e:
            if e.errno != errno.EEXIST:
                raise

        # Copy the compressed file.
        with bz2.BZ2File(sdk_qemu_spi_flash) as from_file:
            with open(path, 'wb') as to_file:
                while True:
                    data = from_file.read(512)
                    if not data:
                        break
                    to_file.write(data)

def _get_spi_path(platform, version):
    if sdk_manager.get_current_sdk() == 'tintin':
        sdk_qemu_spi_flash = os.path.join(
            sdk_manager.path_for_sdk(version),
            'pebble', platform, 'qemu', 'qemu_spi_flash.bin')
        return sdk_qemu_spi_flash

    path = os.path.join(
        get_sdk_persist_dir(platform, version), 'qemu_spi_flash.bin')
    # Always copy SPI image?
    _copy_spi_image(path, platform)
    return path

def _start_emulator(platform):
    sdk_version = os.environ.get("SDK_VER", "4.3")
    qemu_port = _choose_port()
    qemu_serial_port = _choose_port()
    qemu_gdb_port = _choose_port()
    qemu_micro_flash = os.path.join(
        sdk_manager.path_for_sdk(sdk_version),
        'pebble', platform, 'qemu', "qemu_micro_flash.bin")
    qemu_spi_flash = _get_spi_path(platform, sdk_version)
    in_ci = os.environ.get("GITHUB_ACTIONS")
    print("Launching emulator for %s" % platform)
    command = [
        "qemu-pebble",
        "-rtc", "base=localtime",
        "-serial", "null",
        "-serial", "tcp::{},server,nowait".format(qemu_port),
        "-serial", "tcp::{},server".format(qemu_serial_port),
        "-pflash", qemu_micro_flash,
        "-gdb", "tcp::{},server,nowait".format(qemu_gdb_port),
    ]

    if in_ci:
        print("Inside GitHub Actions, will run QEMU in headless mode")
        command.append("-nographic")

    platform_args = {
        'emery': [
            '-machine', 'pebble-robert-bb',
            '-cpu', 'cortex-m4',
            '-pflash', qemu_spi_flash,
        ],
        'diorite': [
            '-machine', 'pebble-silk-bb',
            '-cpu', 'cortex-m4',
            '-mtdblock', qemu_spi_flash,
        ],
        'chalk': [
            '-machine', 'pebble-s4-bb',
            '-cpu', 'cortex-m4',
            '-pflash', qemu_spi_flash,
        ],
        'basalt': [
            '-machine', 'pebble-snowy-bb',
            '-cpu', 'cortex-m4',
            '-pflash', qemu_spi_flash,
        ],
        'aplite': [
            '-machine', 'pebble-bb2',
            '-cpu', 'cortex-m3',
            '-mtdblock', qemu_spi_flash,
        ]
    }

    command.extend(platform_args[platform])

    print("Qemu command: %s" % subprocess.list2cmdline(command))
    process = subprocess.Popen(command)
    time.sleep(0.2)
    if process.poll() is not None:
        try:
            subprocess.check_output(command, stderr=subprocess.STDOUT)
        except subprocess.CalledProcessError as e:
            raise ValueError(
                "Couldn't launch emulator:\n{}".format(e.output.strip()))
    qemu_pid = process.pid
    _wait_for_qemu(qemu_serial_port)
    return qemu_port, qemu_pid

def _wait_for_qemu(qemu_serial_port):
    print("Waiting for the firmware to boot.")
    for i in range(20):
        time.sleep(0.2)
        try:
            s = socket.create_connection(('localhost', qemu_serial_port))
        except socket.error:
            print("QEMU not ready yet.")
            pass
        else:
            break
    else:
        raise ValueError("Emulator launch timed out.")
    received = b''
    while True:
        try:
            received += s.recv(256)
        except socket.error as e:
            # Ignore "Interrupted system call"
            if e.errno != errno.EINTR:
                raise
        if (
                b"<SDK Home>" in received
                or b"<Launcher>" in received
                or b"Ready for communication" in received):
            break
    s.close()
    print("Firmware booted.")

def post_connect(connection):
    print("Setting time on emulator")
    # Make sure the timezone is set usefully.
    if connection.firmware_version.major >= 3:
        ts = time.time()
        tz_offset = -time.altzone if time.localtime(ts).tm_isdst and time.daylight else -time.timezone
        tz_offset_minutes = tz_offset // 60
        tz_name = "UTC%+d" % (tz_offset_minutes / 60)
        connection.send_packet(
            TimeMessage(
                message=SetUTC(
                    unix_time=ts,
                    utc_offset=tz_offset_minutes,
                    tz_name=tz_name
                )
            )
        )


def main(args):
    platform = args.platform
    port, pid = _start_emulator(platform)
    print("Connecting to emulator")
    transport = PebbleTransportQemu.get_transport(
        argparse.Namespace(qemu="localhost:{}".format(port)))
    connection = PebbleConnection(transport)
    connection.connect()
    connection.run_async()
    post_connect(connection)
    with open(".qemu_port", "w") as f:
        f.write(str(port))
    with open(".qemu_pid", "w") as f:
        f.write(str(pid))


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("platform")
    args = parser.parse_args()
    main(args)