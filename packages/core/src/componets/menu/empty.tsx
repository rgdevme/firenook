import { Text } from '@mantine/core'

export const MenuEmptyState = ({ label = '--' }: { label?: string }) => (
	<Text size='md' px='sm' c='stone.3' style={{ pointerEvents: 'none' }}>
		{label}
	</Text>
)
