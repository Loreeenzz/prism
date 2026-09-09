# Supabase Auth email delivery

Prism uses Supabase Auth for confirmation and password-reset emails. No email-sending package belongs in the Next.js application for this flow; delivery is configured in Supabase Auth.

## Development

Supabase's built-in SMTP service is suitable only for development and testing. It can be restricted to team-member addresses and is rate-limited, so it is not a production mail provider.

## Production setup

1. Choose an SMTP provider such as Resend, Postmark, Amazon SES, SendGrid, or Brevo.
2. Verify a dedicated authentication sending domain, preferably `auth.example.com`.
3. Add the provider's SPF, DKIM, and DMARC DNS records.
4. In Supabase, open Authentication → Emails → SMTP Settings.
5. Enable custom SMTP and enter the provider's host, port, username, password/API key, sender address, and sender name.
6. Use a sender such as `no-reply@auth.example.com`.
7. Keep authentication email traffic separate from marketing email traffic.
8. Disable provider link tracking for Supabase Auth links.
9. Review the Auth email rate limits after enabling custom SMTP.

SMTP credentials belong only in Supabase. Do not add them to `.env.local`, Next.js environment variables, or source control.

### Current project status

The project currently uses a Gmail SMTP account, which is sufficient for
development and private testing. It is not the final verified-domain setup for
a public production launch because Gmail does not verify a project-owned
authentication domain through this configuration.

To complete production email delivery, choose a transactional provider and a
domain you control, then complete the provider's domain verification before
replacing the Gmail SMTP settings in Supabase. Do not change the working Gmail
configuration until the replacement provider has passed a test signup and a
password-reset test.

### Browser configuration required

1. In the SMTP provider, add a dedicated sending subdomain such as
   `auth.example.com`.
2. Add every SPF, DKIM, and DMARC record supplied by the provider to the
   domain's DNS host.
3. Wait for the provider to report the domain as verified.
4. In Supabase, open Authentication → Emails → SMTP Settings and replace the
   Gmail host, username, password, and sender with the provider's values.
5. Use a sender such as `no-reply@auth.example.com` and disable link tracking
   in the provider.
6. Test signup confirmation and password recovery using an address outside the
   Supabase organization team.

## Templates for the current SSR flow

The confirmation route in this project expects a `token_hash` and `type` query parameter.

### Confirm signup

In Authentication → Email Templates → Confirm signup, use a link like:

```html
<p><a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email">
  Confirm your email address
</a></p>
```

### Reset password

Keep the reset link based on `{{ .ConfirmationURL }}` so Supabase preserves the `redirectTo` value sent by the application. Prism sends reset users to `/auth/update-password`.

## Verification checklist

- Sign up with a real test address.
- Confirm the message comes from the intended authentication domain.
- Click the confirmation link and verify it reaches `/protected`.
- Request a password reset and verify it reaches `/auth/update-password`.
- Test a non-team address after custom SMTP is enabled.
- Check provider delivery logs and spam placement.
