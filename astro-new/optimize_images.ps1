Add-Type -AssemblyName System.Drawing

$sourceDir = "c:\Users\AJAY CHAUDHARI\OneDrive\Downloads\most\Moreweb\astro-new\public\images\blog"
$quality = 85

$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, $quality)

Get-ChildItem -Path $sourceDir -Filter *.png | ForEach-Object {
    $img = [System.Drawing.Image]::FromFile($_.FullName)
    $destPath = $_.FullName -replace '\.png$', '.jpg'
    
    echo "Converting $($_.Name) to JPG..."
    $img.Save($destPath, $jpegCodec, $encoderParams)
    $img.Dispose()
    
    # Remove original PNG
    Remove-Item $_.FullName
}
