# 🔧 Fix Login Issue - 500 Internal Server Error

## 🚨 **Problem**
Accounts are created successfully but login fails with:
```
GET https://mcxnjdiotipnfcssdpou.supabase.co/rest/v1/profiles?select=*&id=eq.a1afc469-0d8f-4dcf-8ae0-cf2f2c9731f2 500 (Internal Server Error)
```

## 🎯 **Root Cause**
Row Level Security (RLS) policies are incomplete and have circular references, causing the 500 error when fetching user profiles after successful signup/login.

---

## 🛠️ **Quick Fix (2 Steps)**

### **Step 1: Run Database Fix**
1. Go to [Supabase SQL Editor](https://supabase.com/dashboard/project/mcxnjdiotipnfcssdpou/sql)
2. Copy and paste the entire contents of `fix-rls-policies.sql`
3. Click **Run** to execute

### **Step 2: Test the Fix**
1. Clear browser cache
2. Try logging in with an existing account
3. Create a new test account
4. Verify login redirects to dashboard

---

## 🔍 **What the Fix Does**

### **Before (Broken)**
```sql
-- Circular reference causing 500 error
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')  -- ❌ Circular!
  );
```

### **After (Fixed)**
```sql
-- Custom function avoids circular reference
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  SELECT role INTO user_role FROM public.profiles WHERE id = user_id;
  RETURN user_role = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Clean admin policies
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (public.is_admin(auth.uid()));  -- ✅ Works!
```

---

## 📋 **Complete RLS Policies Added**

### **Profiles Table**
- ✅ Users can view own profile
- ✅ Users can update own profile  
- ✅ Users can insert own profile
- ✅ Admins can view all profiles
- ✅ Admins can insert/update/delete profiles

### **Enrollments Table**
- ✅ Users can view own enrollments
- ✅ Users can insert/update/delete own enrollments
- ✅ Admins can view all enrollments
- ✅ Admins can insert/update/delete enrollments

### **Progress Table**
- ✅ Users can view own progress
- ✅ Users can insert/update own progress
- ✅ Admins can view all progress
- ✅ Admins can insert/update/delete progress

---

## 🚀 **After Fix**

Your MUI Portal will:
- ✅ **Create accounts successfully**
- ✅ **Login without 500 errors**
- ✅ **Redirect to dashboard properly**
- ✅ **Auto-detect admin by email**
- ✅ **Show first name greeting**

---

## 🧪 **Test These Scenarios**

1. **New User Signup**
   - Create account → Should redirect to login
   - Login → Should go to dashboard

2. **Existing User Login**
   - Login → Should go to dashboard
   - See first name greeting

3. **Admin Access**
   - Login with admin email → Should see admin panel
   - Access `/mui-portal/admin`

4. **Route Protection**
   - Try accessing protected routes without login → Should redirect to login

---

## 🔧 **If Still Issues**

### **Check Supabase Logs**
1. Go to Supabase Dashboard → Settings → Logs
2. Look for any remaining SQL errors

### **Verify Profile Creation**
```sql
-- Check if profiles are being created
SELECT * FROM profiles ORDER BY created_at DESC LIMIT 5;
```

### **Manual Admin Setup**
```sql
-- If auto-detection fails, manually set admin
UPDATE profiles SET role = 'admin' WHERE email = 'admin@muiportal.com';
```

---

## 🎯 **Expected Result**

After applying the fix:
- ✅ No more 500 errors
- ✅ Smooth login/signup flow
- ✅ Proper redirects
- ✅ Working admin access
- ✅ First name greeting displays

**Run the SQL fix and test immediately!** 🚀
