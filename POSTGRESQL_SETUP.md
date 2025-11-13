# PostgreSQL Kurulum ve Başlatma Rehberi

## 🔍 PostgreSQL Kurulu mu Kontrol Et

### Windows'ta Kontrol:
1. **Başlat menüsünden ara**: "PostgreSQL" veya "pgAdmin"
2. **Services'i kontrol et**:
   - Windows + R → `services.msc` → Enter
   - "postgresql" ara
   - Durum: "Running" olmalı

### PowerShell'de Kontrol:
```powershell
# PostgreSQL servisini kontrol et
Get-Service -Name "postgresql*"
```

---

## 🚀 PostgreSQL'i Başlatma

### Yöntem 1: Windows Services (Önerilen)
1. Windows + R tuşlarına basın
2. `services.msc` yazın ve Enter'a basın
3. "postgresql" ile başlayan servisi bulun (örn: postgresql-x64-14)
4. Servise sağ tıklayın → **"Start"** seçin

### Yöntem 2: PowerShell (Yönetici Olarak)
```powershell
# Yönetici olarak PowerShell açın
# PostgreSQL servis adını bulun
Get-Service -Name "postgresql*"

# Servisi başlatın (servis adını değiştirin)
Start-Service -Name "postgresql-x64-14"
```

### Yöntem 3: pgAdmin
1. pgAdmin'i açın
2. Sol panelde "Servers" → "PostgreSQL 14" (veya versiyon numaranız)
3. Eğer bağlanamıyorsa, PostgreSQL servisini başlatın

---

## 📦 PostgreSQL Kurulu Değilse

### PostgreSQL'i İndirin ve Kurun:

1. **İndir**: https://www.postgresql.org/download/windows/
2. **Kurulum**:
   - PostgreSQL 14 veya 15 önerilir
   - Port: 5432 (varsayılan)
   - Şifre belirleyin (unutmayın!)
   - Stack Builder: "Skip" yapabilirsiniz

3. **Kurulum Sonrası**:
   - pgAdmin otomatik açılacak
   - Şifrenizi girin

---

## 🗄️ Veritabanı Oluşturma

### pgAdmin ile:
1. pgAdmin'i açın
2. Sol panelde: **Servers** → **PostgreSQL 14** → **Databases**
3. Databases'e sağ tık → **Create** → **Database**
4. Database name: `credit_card_debt_tracker`
5. **Save** tıklayın

### psql ile (Terminal):
```bash
# psql'e bağlan
psql -U postgres

# Veritabanı oluştur
CREATE DATABASE credit_card_debt_tracker;

# Kontrol et
\l

# Çıkış
\q
```

---

## 🔑 .env Dosyasını Güncelleyin

Backend `.env` dosyanızı açın ve güncelleyin:

```env
# PostgreSQL bağlantı bilgilerinizi yazın
DATABASE_URL="postgresql://postgres:ŞIFRENIZ@localhost:5432/credit_card_debt_tracker?schema=public"
```

**Önemli**:
- `postgres` = PostgreSQL kullanıcı adınız (genelde "postgres")
- `ŞIFRENIZ` = Kurulum sırasında belirlediğiniz şifre
- `5432` = Port (varsayılan)
- `credit_card_debt_tracker` = Oluşturduğunuz veritabanı adı

---

## ✅ Test Etme

### 1. PostgreSQL Çalışıyor mu?
```bash
# PostgreSQL'e bağlanmayı dene
psql -U postgres -h localhost -p 5432
```

### 2. Veritabanı Var mı?
```bash
# psql'de çalıştır
\l
```

### 3. Prisma Bağlanabiliyor mu?
```bash
cd backend
npx prisma db pull
```

---

## 🐛 Yaygın Sorunlar

### Sorun 1: "psql: command not found"
**Çözüm**: PostgreSQL'in bin klasörünü PATH'e ekleyin:
- Örnek: `C:\Program Files\PostgreSQL\14\bin`

### Sorun 2: "password authentication failed"
**Çözüm**:
- .env dosyasındaki şifreyi kontrol edin
- PostgreSQL şifrenizi sıfırlayın

### Sorun 3: "port 5432 already in use"
**Çözüm**:
- Başka bir program 5432 portunu kullanıyor
- PostgreSQL'in başka bir instance'ı çalışıyor olabilir

### Sorun 4: "connection timeout"
**Çözüm**:
- PostgreSQL servisi çalışmıyor
- Windows Firewall PostgreSQL'i engelliyor olabilir

---

## 📞 Hızlı Komutlar

```bash
# PostgreSQL servisi durumu
Get-Service -Name "postgresql*"

# Servisi başlat
Start-Service -Name "postgresql-x64-14"

# Servisi durdur
Stop-Service -Name "postgresql-x64-14"

# PostgreSQL'e bağlan
psql -U postgres

# Veritabanlarını listele
\l

# Tabloları listele
\dt

# Çıkış
\q
```

---

## 🎯 Sonraki Adım

PostgreSQL çalıştıktan sonra:

```bash
cd backend
npx prisma migrate dev --name add_password
```

Bu komutu çalıştırabilirsiniz!
