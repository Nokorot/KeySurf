
dest="$HOME/.local/share/chrome-ext/KeySurf"

files="
background.js
chromeCsMerged.js
config.js
KSicon-20-032-1.png
KSicon-20-048-1.png
KSicon-20-064-1.png
license.txt
manifest.json
options.html
options.js
"

# build() {
#     mkdir -p build
#     for v in $files; do
#         # Might want to do some compression of the js files 
#         cp $v build/$v;
#     done
# }

install() {
    mkdir -p $dest
    for v in $files; do
        # Might want to do some compression of the js files 
        cp -r $v "$dest/$v";
    done
}

install
