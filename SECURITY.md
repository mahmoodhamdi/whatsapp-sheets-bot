# Security Policy

## Reporting Security Issues

**Please do NOT open public GitHub issues for security vulnerabilities.**

If you discover a security vulnerability, please report it privately:

- **Email**: hmdy7486@gmail.com
- **Subject**: [SECURITY] WhatsApp Bot - Brief description

We will respond within 48 hours and work with you to understand and address the issue.

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Security Practices

### Authentication & Authorization

- **Password Hashing**: All passwords are hashed using bcrypt with cost factor 12
- **JWT Sessions**: Short-lived tokens with secure cookies (httpOnly, sameSite)
- **Email Verification**: Required before accessing protected features
- **Account Lockout**: Automatic lockout after 5 failed login attempts (15 min)
- **Password Reset**: Secure token-based reset with 1-hour expiration

### Data Protection

- **SQL Injection**: Prevented via Prisma ORM parameterized queries
- **XSS Prevention**: React's automatic escaping + Content Security Policy
- **CSRF Protection**: SameSite cookies + NextAuth CSRF tokens
- **Input Validation**: All inputs validated with Zod schemas
- **Rate Limiting**: Applied to authentication and API endpoints

### Infrastructure

- **HTTPS Only**: All production traffic encrypted with TLS
- **Security Headers**: X-Frame-Options, X-Content-Type-Options, CSP
- **Environment Variables**: Secrets never committed to repository
- **Non-root Container**: Docker container runs as unprivileged user

### Third-Party Services

- **Stripe**: PCI-compliant payment processing (no card data stored locally)
- **Resend**: Secure email delivery with SPF/DKIM
- **WhatsApp (Baileys)**: Session data stored locally, encrypted at rest

## Known Limitations

1. **No Two-Factor Authentication (2FA)** - Planned for future release
2. **WhatsApp Session Persistence** - Requires active connection; session may expire
3. **Single-Tenant Rules** - Auto-reply rules are currently global (not per-user)

## Security Checklist for Deployment

Before deploying to production, ensure:

- [ ] All environment variables are set securely
- [ ] `NEXTAUTH_SECRET` is a strong random value (32+ characters)
- [ ] `DATABASE_URL` uses SSL in production (`?sslmode=require`)
- [ ] Stripe webhook secret is configured correctly
- [ ] HTTPS is enabled with valid SSL certificate
- [ ] Rate limiting is active on authentication endpoints
- [ ] Error messages don't expose sensitive information
- [ ] Debug/development features are disabled
- [ ] Database backups are configured
- [ ] Monitoring and alerting are set up

## Dependency Management

- Dependencies are regularly updated using `npm audit`
- Critical security patches are applied within 24 hours
- Run `npm audit` to check for known vulnerabilities

```bash
# Check for vulnerabilities
npm audit

# Fix automatically where possible
npm audit fix
```

## Incident Response

In case of a security incident:

1. **Contain**: Disable affected services immediately
2. **Assess**: Determine scope and impact
3. **Notify**: Inform affected users within 72 hours (GDPR requirement)
4. **Remediate**: Fix vulnerability and deploy patch
5. **Review**: Post-mortem and preventive measures

## Updates

This security policy is reviewed and updated quarterly.

**Last Updated**: December 2024
