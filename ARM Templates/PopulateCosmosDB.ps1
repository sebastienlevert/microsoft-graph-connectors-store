param(
    [string]
    $MasterKey,

    [string]
    $EndpointURI,

    [string]
    $DatabaseID,

    [string]
    $ContainerID
)
Add-Type -AssemblyName System.Web

Function Generate-MasterKeyAuthorizationSignature{

    [CmdletBinding()]

    param (

        [string] $Verb,
        [string] $ResourceId,
        [string] $ResourceType,
        [string] $Date,
        [string] $MasterKey,
    	[String] $KeyType,
        [String] $TokenVersion
    )

    $keyBytes = [System.Convert]::FromBase64String($MasterKey)
    $sigCleartext = @($Verb.ToLower() + "`n" + $ResourceType.ToLower() + "`n" + $ResourceId + "`n" + $Date.ToString().ToLower() + "`n" + "" + "`n")
    $bytesSigClear = [Text.Encoding]::UTF8.GetBytes($sigCleartext)
    $hmacsha = new-object -TypeName System.Security.Cryptography.HMACSHA256 -ArgumentList (, $keyBytes)
    $hash = $hmacsha.ComputeHash($bytesSigClear) 
    $signature = [System.Convert]::ToBase64String($hash)
    $key = [System.Web.HttpUtility]::UrlEncode('type='+$KeyType+'&ver='+$TokenVersion+'&sig=' + $signature)
    return $key
}

$KeyType = "master"
$TokenVersion = "1.0"
$date = Get-Date
$utcDate = $date.ToUniversalTime()
$xDate = $utcDate.ToString('r', [System.Globalization.CultureInfo]::InvariantCulture)

$itemResourceType = "docs"
$itemResourceId = "dbs/" + ${Env:DatabaseID} + "/colls/" + ${Env:ContainerID}

$itemResourceLink = "dbs/" + ${Env:DatabaseID} + "/colls/" + ${Env:ContainerID} + "/docs"
$verbMethod = "POST"

$requestUri = "${Env:EndpointURI}$itemResourceLink"

$authKey = Generate-MasterKeyAuthorizationSignature -Verb $verbMethod `
    -ResourceId $itemResourceId `
    -ResourceType $itemResourceType `
    -Date $xDate `
    -MasterKey ${Env:MasterKey} `
    -KeyType $KeyType `
    -TokenVersion $TokenVersion


# Read content from JSON file on GitHub
$sampleDataURI = "https://raw.githubusercontent.com/sebastienlevert/microsoft-graph-connectors-store/ARM/ARM%20Templates/SampleData.json"
$content = (Invoke-WebRequest -Uri $sampleDataURI -Method Get).Content

$json = ConvertFrom-Json $content
foreach ($item in $json)
{
    Write-Host "AuthKey:$authKey"
    $header = @{
        "authorization"         = "$authKey";
        "x-ms-version"          = "2018-12-31";
        "Cache-Control"         = "no-cache";
        "x-ms-date"             = "$xDate";
        "Accept"                = "application/json";
        "User-Agent"            = "PowerShell-RestApi-Samples";
        "x-ms-documentdb-partitionkey" = '["' + $item.title + '"]'
    }

    $ItemDefinition = ConvertTo-JSON $item

    try
    {
        Write-Host "Creating item $($item.title)..." -NoNewline
        $result = Invoke-RestMethod -Uri $requestUri -Headers $header -Method $verbMethod -ContentType "application/json" -Body $ItemDefinition
        Write-Host "Done"
    }
    catch {
        # Dig into the exception to get the Response details.
        # Note that value__ is not a typo.
        Write-Host "StatusCode:" $_.Exception.Response.StatusCode.value__ 
        Write-Host "Exception Message:" $_.Exception.Message
    }
}
return
