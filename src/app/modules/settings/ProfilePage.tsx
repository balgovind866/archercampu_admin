import { FC, useState } from 'react'
import { PageTitle } from '../../../_metronic/layout/core'
import { Content } from '../../../_metronic/layout/components/content'
import { useAuth } from '../auth'
import { updateProfile } from '../auth/core/_requests'
import { UserModel } from '../auth/core/_models'

const ProfilePage: FC = () => {
  const { currentUser, setCurrentUser } = useAuth()
  
  // Profile settings state
  const [name, setName] = useState(currentUser?.name || '')
  const [email, setEmail] = useState(currentUser?.email || '')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccessMessage(null)
    setErrorMessage(null)

    if (!name || !email) {
      setErrorMessage('Name and Email are required.')
      return
    }

    if (password && password !== confirmPassword) {
      setErrorMessage('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      const payload: { name: string; email: string; password?: string } = {
        name,
        email,
      }
      if (password) {
        payload.password = password
      }

      const role = currentUser?.role === 'super_admin' ? 'super_admin' : 'admin'
      const response = await updateProfile(payload, role)

      if (response.data.success) {
        setSuccessMessage('Profile updated successfully!')
        setPassword('')
        setConfirmPassword('')
        
        // Update context user state
        const updatedUser = (response.data as any).admin || (response.data as any).user
        if (updatedUser) {
          setCurrentUser({
            ...currentUser,
            ...updatedUser
          } as UserModel)
        }
      }
    } catch (error: any) {
      console.error(error)
      setErrorMessage(error.response?.data?.error || 'An error occurred while updating profile.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='card mb-5 mb-xl-10'>
      <div className='card-header border-0 cursor-pointer' role='button'>
        <div className='card-title m-0'>
          <h3 className='fw-bolder m-0'>Profile & Password Settings</h3>
        </div>
      </div>

      <div className='collapse show'>
        <form onSubmit={handleSubmit} className='form'>
          <div className='card-body border-top p-9'>
            {successMessage && (
              <div className='alert alert-success d-flex align-items-center p-4 rounded mb-8'>
                <i className='bi bi-check-circle fs-3 text-success me-3'></i>
                <span className='fw-bold'>{successMessage}</span>
              </div>
            )}

            {errorMessage && (
              <div className='alert alert-danger d-flex align-items-center p-4 rounded mb-8'>
                <i className='bi bi-exclamation-triangle fs-3 text-danger me-3'></i>
                <span className='fw-bold'>{errorMessage}</span>
              </div>
            )}

            {/* Name input */}
            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label required fw-bold fs-6'>Full Name</label>
              <div className='col-lg-8 fv-row'>
                <input
                  type='text'
                  className='form-control form-control-lg form-control-solid'
                  placeholder='Full Name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            {/* Email input */}
            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label required fw-bold fs-6'>Email Address</label>
              <div className='col-lg-8 fv-row'>
                <input
                  type='email'
                  className='form-control form-control-lg form-control-solid'
                  placeholder='Email address'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password inputs */}
            <div className='row mb-6 border-top pt-6'>
              <label className='col-lg-4 col-form-label fw-bold fs-6'>
                New Password
                <span className='text-muted fs-8 d-block fw-normal mt-1'>
                  Leave blank to keep current password
                </span>
              </label>
              <div className='col-lg-8'>
                <div className='row'>
                  <div className='col-lg-6 fv-row mb-4 mb-lg-0'>
                    <input
                      type='password'
                      className='form-control form-control-lg form-control-solid'
                      placeholder='Enter new password'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className='col-lg-6 fv-row'>
                    <input
                      type='password'
                      className='form-control form-control-lg form-control-solid'
                      placeholder='Confirm new password'
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='card-footer d-flex justify-content-end py-6 px-9'>
            <button
              type='submit'
              className='btn btn-primary'
              disabled={loading}
            >
              {loading ? (
                <span className='indicator-progress d-flex align-items-center gap-2'>
                  <span className='spinner-border spinner-border-sm align-middle'></span>
                  Saving Changes...
                </span>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const ProfilePageWrapper: FC = () => {
  return (
    <>
      <PageTitle breadcrumbs={[]}>My Profile Settings</PageTitle>
      <Content>
        <ProfilePage />
      </Content>
    </>
  )
}

export { ProfilePageWrapper }
