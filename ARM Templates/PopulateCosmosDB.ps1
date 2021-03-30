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
	Write-Host "sigCleartext = " $sigCleartext
    $bytesSigClear = [Text.Encoding]::UTF8.GetBytes($sigCleartext)
    $hmacsha = new-object -TypeName System.Security.Cryptography.HMACSHA256 -ArgumentList (, $keyBytes)
    $hash = $hmacsha.ComputeHash($bytesSigClear) 
    $signature = [System.Convert]::ToBase64String($hash)
    $key = [System.Web.HttpUtility]::UrlEncode('type='+$KeyType+'&ver='+$TokenVersion+'&sig=' + $signature)
    return $key
}
Write-Host "Here"

$KeyType = "master"
$TokenVersion = "1.0"
$date = Get-Date
$utcDate = $date.ToUniversalTime()
$xDate = $utcDate.ToString('r', [System.Globalization.CultureInfo]::InvariantCulture)
$itemId = "TestItem"
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

Write-Host "AuthKey:$authKey"
$header = @{
    "authorization"         = "$authKey";
    "x-ms-version"          = "2018-12-31";
    "Cache-Control"         = "no-cache";
    "x-ms-date"             = "$xDate";
    "Accept"                = "application/json";
    "User-Agent"            = "PowerShell-RestApi-Samples";
    "x-ms-documentdb-partitionkey" = '["ASUS Zenbook Jeeze"]'
}

$ItemDefinition = @"
{
    "id": "259bb32d90d648598fd372b4b3c0393e",
    "title": "ASUS Zenbook Jeeze",
    "thumbnailUrl": "https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE3zid7?ver=37e7&q=90&m=6&h=270&w=270&b=%23FFFFFFFF&f=jpg&o=f&aim=true",
    "company": "Asus",
    "category": "Laptop",
    "description": "Pro VInny Slim and stylish, available in 13.5 inch and new 15 inch touchscreens, rich color options, and two durable finishes. Make a powerful statement and get improved speed, performance, and all-day battery life.",
    "price": 100.11,
    "url": "https://www.microsoft.com/en-us/p/surface-laptop-3/8vfggh1r94tm?activetab=overview&cid=msft_web_collection",
    "audience": [
        {
            "id": "e09e4dce-4ec1-4f9e-a482-107eec83a376",
            "type": "user"
        },
        {
            "id": "267eb93c-c6c4-4f4e-b6f1-5671103eb8ee",
            "type": "user"
        },
        {
            "id": "5e2ff59c-bc04-4bbe-b046-03acd420b71a",
            "type": "user"
        }
    ],
    "_rid": "ta5nAKDymXwDAAAAAAAAAA==",
    "_self": "dbs/ta5nAA==/colls/ta5nAKDymXw=/docs/ta5nAKDymXwDAAAAAAAAAA==/",
    "_etag": "\"55003292-0000-0200-0000-605e1a900000\"",
    "_attachments": "attachments/",
    "_ts": 1616779920
}
"@

try {
    Write-Host "Invoking $requestUri with {$($header | Out-String)}"
    $result = Invoke-RestMethod -Uri $requestUri -Headers $header -Method $verbMethod -ContentType "application/json" -Body $ItemDefinition
    Write-Host "create item response = "$result
    return "CreateItemSuccess";
}
catch {
    # Dig into the exception to get the Response details.
    # Note that value__ is not a typo.
    Write-Host "StatusCode:" $_.Exception.Response.StatusCode.value__ 
    Write-Host "Exception Message:" $_.Exception.Message
	echo $_.Exception|format-list -force
}
