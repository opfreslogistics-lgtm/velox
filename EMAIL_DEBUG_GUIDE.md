# Email Debugging Guide

## How to Check Console Logs

### During Development (Local)

1. **Open your terminal/command prompt** where you ran `npm run dev` or `yarn dev`
2. **Look for log messages** that start with:
   - `[email]` - Email service logs
   - `[mailer]` - SMTP mailer logs
   - `[shipments:create]` - Shipment creation logs
   - `[shipments:update]` - Shipment update logs

3. **Example log output:**
   ```
   [shipments:create] Attempting to send email notification
   [email] sendShipmentCreatedEmail called
   [mailer] sendEmail called
   [mailer] Email sent successfully
   ```

### In Production

- Check your hosting platform's logs:
  - **Vercel**: Dashboard → Your Project → Logs
  - **Netlify**: Site settings → Functions → Logs
  - **Other platforms**: Check their documentation for log access

## Testing Email Functionality

### Step 1: Test Email Endpoint

Use this test endpoint to verify your SMTP configuration:

**Using curl (command line):**
```bash
curl -X POST http://localhost:3000/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"to": "your-email@example.com"}'
```

**Using browser console (F12):**
```javascript
fetch('/api/test-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ to: 'your-email@example.com' })
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
```

**Using Postman or similar:**
- Method: POST
- URL: `http://localhost:3000/api/test-email`
- Body (JSON):
  ```json
  {
    "to": "your-email@example.com"
  }
  ```

### Step 2: Check Email Status in API Responses

When you create or update a shipment, the response now includes an `emailStatus` object:

```json
{
  "id": "...",
  "tracking_number": "...",
  "emailStatus": {
    "attempted": true,
    "senderSent": true,
    "recipientSent": true,
    "errors": []
  }
}
```

## Common Issues and Solutions

### Issue 1: "SMTP configuration is missing"

**Solution:** Make sure your `.env.local` file has:
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com
```

### Issue 2: "Invalid login" or "Authentication failed"

**Solution:**
- For Gmail: Use an [App Password](https://support.google.com/accounts/answer/185833) instead of your regular password
- Make sure 2-factor authentication is enabled
- Check that `SMTP_USER` and `SMTP_PASS` are correct

### Issue 3: "No email recipients were provided"

**Solution:** Check that:
- `sender_email` and `recipient_email` are valid email addresses
- They're not empty strings
- They match the email format: `user@domain.com`

### Issue 4: Emails not appearing in inbox

**Check:**
1. Spam/Junk folder
2. Console logs for errors
3. SMTP server logs (if available)
4. Email service provider (Gmail, Outlook, etc.) may have rate limits

## Environment Variables Checklist

Make sure these are set in your `.env.local` file:

```env
# SMTP Configuration (Required)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com

# Optional Admin Emails
SUPPORT_EMAIL=support@example.com
SALES_EMAIL=sales@example.com
ADMIN_EMAIL=admin@example.com
```

## Next Steps

1. **Test the email endpoint first** to verify SMTP works
2. **Check console logs** when creating/updating shipments
3. **Look at the `emailStatus` in API responses** to see what happened
4. **Check your email inbox** (and spam folder)

If emails still don't work after checking all of the above, share the console log output and we can debug further!

