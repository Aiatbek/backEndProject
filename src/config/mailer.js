import nodemailer from 'nodemailer'

/**
 * Nodemailer transporter using Gmail + App Password.
 * Set GMAIL_USER and GMAIL_PASS in your .env file.
 */
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
})

// ── Shared HTML wrapper ───────────────────────────────────────────────────────
function htmlWrapper(content) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <body style="margin:0;padding:0;background:#1A1008;font-family:'DM Sans',Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#1A1008;padding:40px 0;">
        <tr><td align="center">
          <table width="560" cellpadding="0" cellspacing="0"
            style="background:#221508;border-radius:16px;border:1px solid #3D2910;overflow:hidden;">

            <!-- Header -->
            <tr>
              <td style="padding:28px 32px;border-bottom:1px solid #3D2910;">
                <p style="margin:0;font-size:24px;font-weight:700;color:#E8640C;">🔥 KBBQ Restaurant</p>
                <p style="margin:4px 0 0;font-size:13px;color:#9C7A56;">Houston, TX</p>
              </td>
            </tr>

            <!-- Content -->
            <tr><td style="padding:32px;">${content}</td></tr>

            <!-- Footer -->
            <tr>
              <td style="padding:20px 32px;border-top:1px solid #3D2910;text-align:center;">
                <p style="margin:0;font-size:12px;color:#9C7A56;">
                  KBBQ Restaurant · 1234 Korean BBQ Blvd, Houston TX 77001
                </p>
                <p style="margin:4px 0 0;font-size:12px;color:#9C7A56;">
                  +1 (713) 555-0000 · <a href="mailto:info@kbbq.com" style="color:#E8640C;">info@kbbq.com</a>
                </p>
              </td>
            </tr>
          </table>
        </td></tr>
      </table>
    </body>
    </html>
  `
}

// ── Row helper ────────────────────────────────────────────────────────────────
function row(label, value) {
  return `
    <tr>
      <td style="padding:10px 0;color:#9C7A56;font-size:14px;border-bottom:1px solid #3D2910;
                 width:40%;vertical-align:top;">${label}</td>
      <td style="padding:10px 0;color:#F5E6D0;font-size:14px;border-bottom:1px solid #3D2910;
                 font-weight:500;">${value}</td>
    </tr>
  `
}

// ── Reservation confirmation ──────────────────────────────────────────────────
export async function sendReservationConfirmation(reservation) {
  const date = new Date(reservation.date).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  const content = `
    <h1 style="margin:0 0 8px;font-size:22px;color:#F5E6D0;">Reservation confirmed! 🎉</h1>
    <p style="margin:0 0 24px;font-size:14px;color:#9C7A56;line-height:1.6;">
      Hi ${reservation.name}, your table at KBBQ Restaurant is booked.
      We can't wait to see you!
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      ${row('Date', date)}
      ${row('Time', reservation.time)}
      ${row('Guests', reservation.numberOfGuests)}
      ${row('Name', reservation.name)}
      ${row('Phone', reservation.phone)}
      ${reservation.specialRequests ? row('Special requests', reservation.specialRequests) : ''}
      ${row('Status', `<span style="color:#E8640C;font-weight:600;">${reservation.status}</span>`)}
    </table>

    <div style="background:#2E1E0E;border-radius:10px;padding:16px;margin-bottom:24px;">
      <p style="margin:0;font-size:13px;color:#9C7A56;line-height:1.6;">
        📍 <strong style="color:#F5E6D0;">1234 Korean BBQ Blvd, Houston TX 77001</strong><br/>
        ⏱ Please arrive 5–10 minutes early. If you need to cancel, call us at
        <a href="tel:+17135550000" style="color:#E8640C;">+1 (713) 555-0000</a>.
      </p>
    </div>

    <a href="http://localhost:5173/reservations"
      style="display:inline-block;background:#E8640C;color:#fff;padding:12px 28px;
             border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;">
      View my reservations
    </a>
  `

  await transporter.sendMail({
    from: `"KBBQ Restaurant" <${process.env.GMAIL_USER}>`,
    to: reservation.email,
    subject: `✅ Reservation confirmed — ${date} at ${reservation.time}`,
    html: htmlWrapper(content),
  })
}

// ── Order confirmation ────────────────────────────────────────────────────────
export async function sendOrderConfirmation(order, user, populatedItems) {
  const itemRows = populatedItems.map(item =>
    row(
      `${item.quantity}× ${item.name}`,
      `$${(item.price * item.quantity).toFixed(2)}`
    )
  ).join('')

  const content = `
    <h1 style="margin:0 0 8px;font-size:22px;color:#F5E6D0;">Order received! 🍖</h1>
    <p style="margin:0 0 24px;font-size:14px;color:#9C7A56;line-height:1.6;">
      Hi ${user.name}, we've received your order and it's being prepared.
      Come pick it up at the counter when ready.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      ${itemRows}
      <tr>
        <td style="padding:12px 0;color:#E8640C;font-size:15px;font-weight:700;">Total</td>
        <td style="padding:12px 0;color:#E8640C;font-size:15px;font-weight:700;">
          $${order.totalPrice.toFixed(2)}
        </td>
      </tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      ${row('Order type', 'Pickup')}
      ${row('Status', `<span style="color:#FBBF24;font-weight:600;">${order.status}</span>`)}
      ${row('Est. wait', '15–25 minutes')}
    </table>

    <div style="background:#2E1E0E;border-radius:10px;padding:16px;margin-bottom:24px;">
      <p style="margin:0;font-size:13px;color:#9C7A56;line-height:1.6;">
        📍 Pick up at the counter · <strong style="color:#F5E6D0;">1234 Korean BBQ Blvd</strong><br/>
        📞 Questions? Call <a href="tel:+17135550000" style="color:#E8640C;">+1 (713) 555-0000</a>
      </p>
    </div>

    <a href="http://localhost:5173/orders"
      style="display:inline-block;background:#E8640C;color:#fff;padding:12px 28px;
             border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;">
      Track my order
    </a>
  `

  await transporter.sendMail({
    from: `"KBBQ Restaurant" <${process.env.GMAIL_USER}>`,
    to: user.email,
    subject: `🍖 Order confirmed — $${order.totalPrice.toFixed(2)} · Pickup`,
    html: htmlWrapper(content),
  })
}
