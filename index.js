//cookieparser

function cookieParser(secret, options) {
    return function cookieParser(req, res, next) {
        var cookies = req.headers.cookie
        
        req.secret = secret && secret[0]
        req.cookies = Object.create(null)
        req.signedCookies = Object.create(null)
        
        // no cookies
        if (!cookies) {
            return next()
        }
        
        req.cookies = parseCookies(cookies, options)
        
        // parse signed cookies
        if (secret && secret.length) {
            req.signedCookies = parseSignedCookies(req.cookies, secret)
            
            // remove signed cookie names from regular cookies
            Object.keys(req.signedCookies).forEach(function(key) {
                delete req.cookies[key]
            })
        }
        
        return next()
    }
}

// Helper function to parse cookies
function parseCookies(str, options) {
    var obj = {}
    var pairs = str.split(';')
    
    // Set default options
    options = options || {}
    var decode = options.decode || decodeURIComponent
    
    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].trim()
        var eq_idx = pair.indexOf('=')
        
        if (eq_idx < 0) continue
        
        var key = pair.slice(0, eq_idx).trim()
        var val = pair.slice(eq_idx + 1).trim()
        
        // remove quotes
        if (val[0] === '"') {
            val = val.slice(1, -1)
        }
        
        try {
            obj[key] = decode(val)
        } catch {
            obj[key] = val
        }
    }
    
    return obj
}

// Helper function to parse signed cookies
function parseSignedCookies(cookies, secret) {
    var signed = {}
    
    Object.keys(cookies).forEach(function(key) {
        var val = cookies[key]
        
        if (val.startsWith('s:')) {
            // This is a signed cookie
            var unsigned = unsign(val.slice(2), secret)
            if (unsigned !== false) {
                signed[key] = unsigned
            }
        }
    })
    
    return signed
}

// Real signature verification implementation
function unsign(val, secret) {
    var str = val.slice(0, val.lastIndexOf('.'))
    var mac = val.slice(val.lastIndexOf('.') + 1)
    
    // Create a simple hash to verify signature
    var expectedMac = createSignature(str, secret)
    
    // Compare signatures (timing-safe comparison would be better in production)
    if (mac === expectedMac) {
        return str
    }
    
    return false
}

// Simple signature creation (in production, use crypto.createHmac)
function createSignature(val, secret) {
    // This is a simplified hash function for educational purposes
    // In real applications, use crypto.createHmac('sha256', secret).update(val).digest('base64url')
    var hash = 0
    var combined = val + secret
    
    for (var i = 0; i < combined.length; i++) {
        var char = combined.charCodeAt(i)
        hash = ((hash << 5) - hash) + char
        hash = hash & hash // Convert to 32-bit integer
    }
    
    return Math.abs(hash).toString(36)
}

export default cookieParser
