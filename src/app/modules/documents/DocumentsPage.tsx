import { FC, useState, useEffect } from 'react'
import { PageTitle } from '../../../_metronic/layout/core'
import { Content } from '../../../_metronic/layout/components/content'
import { getDocuments, createDocument } from '../auth/core/_requests'
import { DocumentModel } from '../auth/core/_models'

const DocumentsPage: FC = () => {
  const [documents, setDocuments] = useState<DocumentModel[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Modal & Form State
  const [showModal, setShowModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  const fetchDocuments = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await getDocuments()
      if (response?.data?.success) {
        setDocuments(response.data.documents || [])
      } else {
        setError('Failed to fetch documents.')
      }
    } catch (e: any) {
      console.error(e)
      setError(e.response?.data?.error || 'An error occurred while loading isolated documents.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    if (!title) {
      setFormError('Document title is required.')
      return
    }

    setSubmitting(true)
    try {
      const response = await createDocument({ title, content })
      if (response.data.success) {
        setShowModal(false)
        setTitle('')
        setContent('')
        fetchDocuments()
      } else {
        setFormError('Failed to create document.')
      }
    } catch (e: any) {
      console.error(e)
      setFormError(e.response?.data?.error || 'An error occurred while creating document.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <div className='d-flex flex-wrap flex-stack mb-6'>
        <h3 className='fw-bolder my-2'>Isolated Documents</h3>
        <div className='d-flex my-2'>
          <button
            onClick={() => setShowModal(true)}
            className='btn btn-primary btn-sm fw-bold'
          >
            <i className='bi bi-plus-lg fs-5 me-2'></i> Create Isolated Document
          </button>
        </div>
      </div>

      <div className='card mb-5 mb-xl-8'>
        <div className='card-header border-0 pt-5'>
          <h3 className='card-title align-items-start flex-column'>
            <span className='card-label fw-bolder fs-3 mb-1'>Tenant Documents</span>
            <span className='text-muted mt-1 fw-bold fs-7'>These documents exist ONLY in this tenant's PostgreSQL database schema</span>
          </h3>
        </div>

        <div className='card-body py-3'>
          {loading && (
            <div className='d-flex align-items-center justify-content-center p-10'>
              <span className='spinner-border spinner-border-sm align-middle me-2'></span>
              Loading documents...
            </div>
          )}

          {error && (
            <div className='alert alert-danger d-flex align-items-center p-5 rounded mb-10'>
              <span className='fw-bold'>{error}</span>
            </div>
          )}

          {!loading && !error && documents.length === 0 && (
            <div className='text-center text-muted p-10'>
              No documents created yet. Click "Create Isolated Document" to add one.
            </div>
          )}

          {!loading && !error && documents.length > 0 && (
            <div className='table-responsive'>
              <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>
                <thead>
                  <tr className='fw-bolder text-muted'>
                    <th className='min-w-150px'>Title</th>
                    <th className='min-w-200px'>Snippet / Content</th>
                    <th className='min-w-120px'>Created By</th>
                    <th className='min-w-100px text-end'>Created Date</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc) => (
                    <tr key={doc.id}>
                      <td>
                        <div className='d-flex align-items-center'>
                          <div className='symbol symbol-40px me-5'>
                            <span className='symbol-label bg-light-success text-success fw-bolder fs-4'>
                              <i className='bi bi-file-earmark-text text-success fs-3'></i>
                            </span>
                          </div>
                          <span className='text-gray-900 fw-bolder fs-6'>
                            {doc.title}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className='text-gray-700 fs-7 text-hover-primary fw-medium d-block text-truncate' style={{ maxWidth: '300px' }}>
                          {doc.content || <em className='text-muted'>No description</em>}
                        </span>
                      </td>
                      <td>
                        <div className='d-flex flex-column'>
                          <span className='text-gray-900 fw-bold fs-6'>
                            {doc.creator?.name || 'Unknown'}
                          </span>
                          <span className='text-muted fs-7'>
                            {doc.creator?.email || ''}
                          </span>
                        </div>
                      </td>
                      <td className='text-end'>
                        <span className='text-muted fw-bold d-block fs-7'>
                          {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : 'N/A'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Document Creation Modal */}
      {showModal && (
        <div className='modal fade show d-block' style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} role='dialog'>
          <div className='modal-dialog modal-dialog-centered mw-650px'>
            <div className='modal-content rounded'>
              <div className='modal-header pb-0 border-0 justify-content-end'>
                <button
                  type='button'
                  className='btn btn-sm btn-icon btn-active-color-primary'
                  onClick={() => setShowModal(false)}
                >
                  <i className='bi bi-x-lg fs-4'></i>
                </button>
              </div>

              <div className='modal-body scroll-y px-10 px-lg-15 pt-0 pb-15'>
                <form onSubmit={handleSubmit} className='form'>
                  <div className='mb-13 text-center'>
                    <h1 className='mb-3'>Create Isolated Document</h1>
                    <div className='text-muted fw-bold fs-5'>
                      This document is stored isolated in the current tenant's database schema.
                    </div>
                  </div>

                  {formError && (
                    <div className='alert alert-danger d-flex align-items-center p-4 rounded mb-5'>
                      <span className='fw-bold fs-7'>{formError}</span>
                    </div>
                  )}

                  <div className='d-flex flex-column mb-8 fv-row'>
                    <label className='d-flex align-items-center fs-6 fw-bold mb-2 required'>
                      Document Title
                    </label>
                    <input
                      type='text'
                      className='form-control form-control-solid'
                      placeholder='Enter document title'
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  <div className='d-flex flex-column mb-8 fv-row'>
                    <label className='d-flex align-items-center fs-6 fw-bold mb-2'>
                      Document Content
                    </label>
                    <textarea
                      className='form-control form-control-solid'
                      rows={5}
                      placeholder='Enter document body/description'
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    />
                  </div>

                  <div className='text-center pt-15'>
                    <button
                      type='button'
                      className='btn btn-light me-3'
                      onClick={() => setShowModal(false)}
                      disabled={submitting}
                    >
                      Cancel
                    </button>
                    <button
                      type='submit'
                      className='btn btn-primary'
                      disabled={submitting}
                    >
                      {submitting ? (
                        <span className='indicator-progress d-flex align-items-center gap-2'>
                          <span className='spinner-border spinner-border-sm align-middle'></span>
                          Saving...
                        </span>
                      ) : (
                        'Save Document'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

const DocumentsPageWrapper: FC = () => {
  return (
    <>
      <PageTitle breadcrumbs={[]}>Tenant Documents</PageTitle>
      <Content>
        <DocumentsPage />
      </Content>
    </>
  )
}

export { DocumentsPageWrapper }
