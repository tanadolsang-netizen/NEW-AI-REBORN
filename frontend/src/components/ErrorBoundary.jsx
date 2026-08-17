import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary]', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#fbfbfd] text-[#111] p-6">
          <div className="max-w-md w-full rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
            <h1 className="text-xl font-semibold mb-2">Something went wrong</h1>
            <p className="text-sm opacity-70 mb-4">
              The UI crashed during render. Open the browser console to see the stack trace.
            </p>
            <pre className="text-xs bg-gray-50 border rounded-lg p-3 overflow-auto max-h-48">
              {String(this.state.error?.message || this.state.error)}
            </pre>
            <button
              className="mt-4 rounded-full bg-black text-white px-4 py-2 text-sm"
              onClick={() => this.setState({ hasError: false, error: null })}
            >
              Try again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
