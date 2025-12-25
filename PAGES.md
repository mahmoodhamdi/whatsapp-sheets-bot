# WhatsApp Bot - Project Pages

## Base URL
http://localhost:3000

---

## Authentication Pages

| Page | URL |
|------|-----|
| Login | http://localhost:3000/login |

---

## Dashboard Pages

| Page | URL |
|------|-----|
| Dashboard (Home) | http://localhost:3000/dashboard |
| Messages | http://localhost:3000/dashboard/messages |
| Contacts | http://localhost:3000/dashboard/contacts |
| Rules | http://localhost:3000/dashboard/rules |
| Create New Rule | http://localhost:3000/dashboard/rules/new |
| Edit Rule | http://localhost:3000/dashboard/rules/[id] |
| Settings | http://localhost:3000/dashboard/settings |
| WhatsApp Settings | http://localhost:3000/dashboard/settings/whatsapp |
| Google Sheets Settings | http://localhost:3000/dashboard/settings/sheets |

---

## API Endpoints

### Authentication
| Method | Endpoint |
|--------|----------|
| POST | http://localhost:3000/api/auth/[...nextauth] |

### Contacts
| Method | Endpoint |
|--------|----------|
| GET | http://localhost:3000/api/contacts |
| GET | http://localhost:3000/api/contacts/[id] |
| DELETE | http://localhost:3000/api/contacts/[id] |

### Messages
| Method | Endpoint |
|--------|----------|
| GET | http://localhost:3000/api/messages |
| GET | http://localhost:3000/api/messages/[contactId] |
| POST | http://localhost:3000/api/messages/send |

### Rules
| Method | Endpoint |
|--------|----------|
| GET | http://localhost:3000/api/rules |
| POST | http://localhost:3000/api/rules |
| GET | http://localhost:3000/api/rules/[id] |
| PUT | http://localhost:3000/api/rules/[id] |
| DELETE | http://localhost:3000/api/rules/[id] |
| PATCH | http://localhost:3000/api/rules/[id]/toggle |

### WhatsApp
| Method | Endpoint |
|--------|----------|
| GET | http://localhost:3000/api/whatsapp/status |
| POST | http://localhost:3000/api/whatsapp/connect |
| POST | http://localhost:3000/api/whatsapp/disconnect |
| GET | http://localhost:3000/api/whatsapp/qr |

### Google Sheets
| Method | Endpoint |
|--------|----------|
| GET | http://localhost:3000/api/sheets/status |
| POST | http://localhost:3000/api/sheets/sync |
| GET | http://localhost:3000/api/sheets/logs |

### Settings
| Method | Endpoint |
|--------|----------|
| GET | http://localhost:3000/api/settings |
| PUT | http://localhost:3000/api/settings |

### Analytics
| Method | Endpoint |
|--------|----------|
| GET | http://localhost:3000/api/analytics/overview |
| GET | http://localhost:3000/api/analytics/messages |
| GET | http://localhost:3000/api/analytics/rules |

---

## Login Credentials

- **Email**: admin@example.com
- **Password**: SecurePassword123!
