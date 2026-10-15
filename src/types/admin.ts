export interface AdminUser {
  id: string
  email: string
  email_confirmed_at: string | null
  created_at: string
  role: 'super_admin' | 'admin'
  is_approved: boolean
}
