$base = "https://html-classic.itch.zone/html/14967635/"
$folder = "C:\raftgame\"

Write-Host "Downloading index.html..."
curl "$($base)index.html" -o "$($folder)index.html"

Write-Host "Reading index.html..."
$content = Get-Content "$($folder)index.html" -Raw

$regex = '(?<=src="|href=")[^"]+'
$matches = [regex]::Matches($content, $regex)

foreach ($m in $matches) {
    $file = $m.Value

    if ($file -notmatch "^http") {
        $url = $base + $file
        $out = Join-Path $folder $file

        $dir = Split-Path $out
        if (!(Test-Path $dir)) {
            New-Item -ItemType Directory -Path $dir -Force | Out-Null
        }

        Write-Host "Downloading $url"
        curl $url -o $out
    }
}

Write-Host "Done!"
