declare module 'photoswipe' {
    const mocked: jest.Mock
    export default mocked
}

interface Window {
    Image: typeof Image
}
