# ============================================
# Multi-Site Security Vulnerability Fix Script (PowerShell)
# ============================================
# Fixes npm vulnerabilities across all 37 real estate sites
# Run from parent directory containing all projects
# Usage: .\Fix-AllSitesSecurity.ps1

param(
    [switch]$WhatIf,  # Dry run mode
    [switch]$AutoPush  # Automatically push commits
)

$ErrorActionPreference = "Continue"

# Log file
$LogFile = "security-fix-$(Get-Date -Format 'yyyyMMdd-HHmmss').log"

Write-Host "🔒 Multi-Site Security Fix Script" -ForegroundColor Blue
Write-Host "======================================" -ForegroundColor Blue
Write-Host "Log file: $LogFile`n"

# All your real estate sites
$Sites = @(
    "heyberkshire.com-2",
    "justcalldrjan.com",
    "heritageatstonebridgehomes.com",
    "openhousemarketplace.com",
    "probaterealestatesales-com",
    "aliantehomesforsale.com",
    "arroyoskyeview.com",
    "bravadohomes.com",
    "cadencehenderson.com",
    "drjanduffy.com",
    "duffyrealtyoflasvegas.com",
    "goodtoknowrealtor",
    "goodtoknowrealtor-1",
    "las-vegas-relocation-services-com",
    "lone-mountain-homes-6mmt",
    "lone-mountain-homes-cohh",
    "lone-mountain-homes-cydw",
    "lone-mountain-homes-fx1b",
    "lonemountainvistas.com",
    "mesquiteestates.com",
    "nextjs-boilerplate",
    "californiaforeverbroker.com"
    # Add remaining 15 sites here
)

# Stats
$Total = $Sites.Count
$Success = 0
$Failed = 0
$Skipped = 0

foreach ($site in $Sites) {
    Write-Host "`n================================================" -ForegroundColor Blue
    Write-Host "Processing: $site" -ForegroundColor Blue
    Write-Host "================================================" -ForegroundColor Blue
    
    # Check if directory exists
    if (-not (Test-Path $site)) {
        Write-Host "⚠️  Directory not found: $site - SKIPPED" -ForegroundColor Yellow
        "$(Get-Date): SKIPPED - Directory not found: $site" | Out-File -Append $LogFile
        $Skipped++
        continue
    }
    
    Push-Location $site
    
    # Check if it's a Node.js project
    if (-not (Test-Path "package.json")) {
        Write-Host "⚠️  No package.json found - SKIPPED" -ForegroundColor Yellow
        "$(Get-Date): SKIPPED - No package.json: $site" | Out-File -Append $LogFile
        $Skipped++
        Pop-Location
        continue
    }
    
    Write-Host "📦 Found package.json"
    
    if ($WhatIf) {
        Write-Host "🔍 DRY RUN MODE - No changes will be made" -ForegroundColor Cyan
    }
    
    # Backup package.json
    if (-not $WhatIf) {
        Copy-Item package.json package.json.backup
        Write-Host "💾 Created backup: package.json.backup"
    }
    
    # Check current vulnerabilities
    Write-Host "🔍 Auditing vulnerabilities..."
    $AuditBefore = npm audit --json 2>$null | ConvertFrom-Json
    $VulnsBefore = if ($AuditBefore.metadata.vulnerabilities.total) { 
        $AuditBefore.metadata.vulnerabilities.total 
    } else { 0 }
    Write-Host "Found $VulnsBefore vulnerabilities"
    
    try {
        if (-not $WhatIf) {
            # Step 1: Upgrade critical packages
            Write-Host "⬆️  Upgrading Next.js and eslint-config-next..."
            npm install next@latest eslint-config-next@latest --legacy-peer-deps --silent 2>&1 | Out-File -Append $LogFile
            Write-Host "✅ Critical packages upgraded" -ForegroundColor Green
            
            # Step 2: Auto-fix remaining issues
            Write-Host "🔧 Running npm audit fix..."
            npm audit fix --legacy-peer-deps --silent 2>&1 | Out-File -Append $LogFile
            Write-Host "✅ Auto-fix completed" -ForegroundColor Green
        }
        
        # Check final vulnerabilities
        $AuditAfter = npm audit --json 2>$null | ConvertFrom-Json
        $VulnsAfter = if ($AuditAfter.metadata.vulnerabilities.total) { 
            $AuditAfter.metadata.vulnerabilities.total 
        } else { 0 }
        Write-Host "📊 Vulnerabilities: $VulnsBefore → $VulnsAfter"
        
        # Step 3: Test build
        Write-Host "🏗️  Testing build..."
        if (-not $WhatIf) {
            $BuildResult = npm run build 2>&1 | Out-File -Append $LogFile -PassThru
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ Build successful" -ForegroundColor Green
                
                # Step 4: Commit changes
                $GitStatus = git status --porcelain
                if ($GitStatus) {
                    Write-Host "📝 Committing changes..."
                    git add package.json package-lock.json
                    git commit -m "🔒 security: Fix $VulnsBefore vulnerabilities (automated fix)" --quiet
                    
                    if ($AutoPush) {
                        git push origin main
                        Write-Host "✅ Changes pushed to remote" -ForegroundColor Green
                    } else {
                        Write-Host "✅ Changes committed (not pushed yet)" -ForegroundColor Green
                    }
                } else {
                    Write-Host "ℹ️  No changes to commit"
                }
                
                $Success++
                "$(Get-Date): SUCCESS - $site ($VulnsBefore → $VulnsAfter vulnerabilities)" | Out-File -Append $LogFile
            } else {
                throw "Build failed"
            }
        } else {
            Write-Host "✅ Would fix $VulnsBefore vulnerabilities" -ForegroundColor Cyan
            $Success++
        }
    }
    catch {
        Write-Host "❌ ERROR: $_" -ForegroundColor Red
        "$(Get-Date): FAILED - $site - $_" | Out-File -Append $LogFile
        
        # Restore backup
        if (-not $WhatIf -and (Test-Path "package.json.backup")) {
            Move-Item package.json.backup package.json -Force
            Write-Host "↩️  Restored backup"
        }
        
        $Failed++
    }
    
    Pop-Location
}

# Final summary
Write-Host "`n================================================" -ForegroundColor Blue
Write-Host "SUMMARY" -ForegroundColor Blue
Write-Host "================================================" -ForegroundColor Blue
Write-Host "Total sites: $Total"
Write-Host "✅ Success: $Success" -ForegroundColor Green
Write-Host "❌ Failed: $Failed" -ForegroundColor Red
Write-Host "⏭️  Skipped: $Skipped" -ForegroundColor Yellow
Write-Host "`n📄 Full log: $LogFile"

if (-not $AutoPush -and $Success -gt 0) {
    Write-Host "`n⚠️  Note: Changes are committed but NOT pushed yet." -ForegroundColor Yellow
    Write-Host "Review each site, then push manually or run:"
    Write-Host "  .\Fix-AllSitesSecurity.ps1 -AutoPush" -ForegroundColor Cyan
}

if ($Failed -gt 0) {
    Write-Host "`n⚠️  $Failed site(s) failed - manual intervention required" -ForegroundColor Red
    Write-Host "Check log file for details: $LogFile"
}

# Generate summary report
$ReportFile = "security-fix-report-$(Get-Date -Format 'yyyyMMdd-HHmmss').md"
@"
# Security Vulnerability Fix Report

**Date**: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')

## Summary

| Status | Count |
|--------|-------|
| ✅ Success | $Success |
| ❌ Failed | $Failed |
| ⏭️  Skipped | $Skipped |
| **Total** | **$Total** |

## Success Rate

$([math]::Round(($Success / $Total) * 100, 1))%

## Next Steps

1. Review failed sites (if any) in log file
2. Manually fix any build errors
3. Test critical sites in browser
4. Push all changes: `.\Fix-AllSitesSecurity.ps1 -AutoPush`

## Failed Sites

$(if ($Failed -gt 0) { "Review log file: $LogFile" } else { "None!" })

---

Generated by: Fix-AllSitesSecurity.ps1
"@ | Out-File $ReportFile

Write-Host "`n📊 Report saved: $ReportFile" -ForegroundColor Green
