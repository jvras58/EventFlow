export const mockUseAuth = () => {
    const useAuthMock = jest.fn().mockReturnValue({
        token: 'fake-token-123',
        user: { id: '1', nome: 'Test User' },
        isAuthenticated: true,
        login: jest.fn(),
        logout: jest.fn()
    })

    jest.mock('@/providers/auth-provider', () => ({
        useAuth: useAuthMock
    }))

    return useAuthMock
}
