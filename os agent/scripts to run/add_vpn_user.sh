#!/bin/bash

if [ $# -ne 6 ]; then
    echo "Usage: $0 <username> <userpass> <source_ip> <key> <hmac_key> <timeout>"
    exit 1
fi

USERNAME=$1
USERPASS=$2
SOURCE_IP=$3
ACCESS_KEY=$4
HMAC_KEY=$5
TIMEOUT=$6

ADMINPASS='G00dpiRT3435436743(*442!@morning'

CONTAINER="VPN"
HUB="VPN"

echo ">>> Creating VPN user: $USERNAME"

docker exec -i $CONTAINER /usr/local/vpnserver/vpncmd 127.0.0.1:443 \
    /SERVER \
    /HUB:$HUB \
    /PASSWORD:"$ADMINPASS" \
    /CMD UserCreate "$USERNAME" /GROUP:none /REALNAME:"$USERNAME" /NOTE:none | grep "successfully"

docker exec -i $CONTAINER /usr/local/vpnserver/vpncmd 127.0.0.1:443 \
    /SERVER \
    /HUB:$HUB \
    /PASSWORD:"$ADMINPASS" \
    /CMD UserPolicySet "$USERNAME" /NAME:Access /VALUE:yes | grep "successfully"

docker exec -i $CONTAINER /usr/local/vpnserver/vpncmd 127.0.0.1:443 \
    /SERVER \
    /HUB:$HUB \
    /PASSWORD:"$ADMINPASS" \
    /CMD UserPasswordSet "$USERNAME" /PASSWORD:"$USERPASS" | grep "successfully"

echo ">>> Adding fwknop access.conf entry for user $USERNAME"

cat <<EOL >> /etc/fwknop/access.conf

# $USERNAME
SOURCE          $SOURCE_IP
OPEN_PORTS      tcp/8443
KEY             $ACCESS_KEY
HMAC_KEY        $HMAC_KEY
HMAC_DIGEST_TYPE sha256
FW_ACCESS_TIMEOUT $TIMEOUT
EOL

echo ">>> User $USERNAME created and fwknop rule added with comment."
root@viworks:/opt/ViWorks/scripts_viworks#
root@viworks:/opt/ViWorks/scripts_viworks# cat add_vpn_user.sh
#!/bin/bash

if [ $# -ne 6 ]; then
    echo "Usage: $0 <username> <userpass> <source_ip> <key> <hmac_key> <timeout>"
    exit 1
fi

USERNAME=$1
USERPASS=$2
SOURCE_IP=$3
ACCESS_KEY=$4
HMAC_KEY=$5
TIMEOUT=$6

ADMINPASS='G00dpiRT3435436743(*442!@morning'

CONTAINER="VPN"
HUB="VPN"

echo ">>> Creating VPN user: $USERNAME"

docker exec -i $CONTAINER /usr/local/vpnserver/vpncmd 127.0.0.1:443 \
    /SERVER \
    /HUB:$HUB \
    /PASSWORD:"$ADMINPASS" \
    /CMD UserCreate "$USERNAME" /GROUP:none /REALNAME:"$USERNAME" /NOTE:none | grep "successfully"

docker exec -i $CONTAINER /usr/local/vpnserver/vpncmd 127.0.0.1:443 \
    /SERVER \
    /HUB:$HUB \
    /PASSWORD:"$ADMINPASS" \
    /CMD UserPolicySet "$USERNAME" /NAME:Access /VALUE:yes | grep "successfully"

docker exec -i $CONTAINER /usr/local/vpnserver/vpncmd 127.0.0.1:443 \
    /SERVER \
    /HUB:$HUB \
    /PASSWORD:"$ADMINPASS" \
    /CMD UserPasswordSet "$USERNAME" /PASSWORD:"$USERPASS" | grep "successfully"

echo ">>> Adding fwknop access.conf entry for user $USERNAME"

cat <<EOL >> /etc/fwknop/access.conf

# $USERNAME
SOURCE          $SOURCE_IP
OPEN_PORTS      tcp/8443
KEY             $ACCESS_KEY
HMAC_KEY        $HMAC_KEY
HMAC_DIGEST_TYPE sha256
FW_ACCESS_TIMEOUT $TIMEOUT
EOL

echo ">>> User $USERNAME created and fwknop rule added with comment."