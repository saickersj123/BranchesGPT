module.exports = {
  content: [ 
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      zIndex: {
        '1000': '1000', // z-1000 클래스 정의
      },
      margin: {
        '1.25': '0.3125rem', // 1.25 클래스 정의
      }
    },
  },
  plugins: [],
}
