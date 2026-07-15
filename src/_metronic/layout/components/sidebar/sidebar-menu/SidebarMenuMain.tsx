import { useIntl } from 'react-intl'
import { SidebarMenuItem } from './SidebarMenuItem'
import { useAuth } from '../../../../../app/modules/auth'

const SidebarMenuMain = () => {
  const intl = useIntl()
  const { currentUser } = useAuth()
  const isSuperAdmin = currentUser?.role === 'super_admin'

  return (
    <>
      <SidebarMenuItem
        to='/dashboard'
        icon='element-11'
        title={intl.formatMessage({ id: 'MENU.DASHBOARD' })}
        fontIcon='bi-app-indicator'
      />
      {isSuperAdmin ? (
        <SidebarMenuItem
          to='/tenants'
          icon='abstract-26'
          title='Tenants'
          fontIcon='bi-layers'
        />
      ) : (
        <SidebarMenuItem
          to='/documents'
          icon='document'
          title='Documents'
          fontIcon='bi-file-text'
        />
      )}
    </>
  )
}

export { SidebarMenuMain }
