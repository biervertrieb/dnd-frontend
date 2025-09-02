import { useState } from "react";
import { useAppStore } from "../../app/AppStore";

const LoginPage = () => {
    const login = useAppStore((s) => s.login);
    const error = useAppStore((s) => s.authError);
    const loading = useAppStore((s) => s.authLoading);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await login(username, password);
    };

    return (
        <div className="max-w-md mx-auto mt-40 px-8 py-10 bg-gradient-to-br from-amber-50/95 to-amber-100/95 rounded-xl shadow-lg border-2 border-yellow-600">
            <h2 className="text-2xl font-bold text-amber-800 mb-6 text-center">Login</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <input
                    type="text"
                    placeholder="Username or Email"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="border-2 border-amber-800 rounded-lg px-4 py-2 text-lg focus:outline-none focus:border-yellow-500"
                    autoFocus
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="border-2 border-amber-800 rounded-lg px-4 py-2 text-lg focus:outline-none focus:border-yellow-500"
                    required
                />
                <button
                    type="submit"
                    className="bg-gradient-to-r from-amber-800 to-amber-700 border border-yellow-600 text-yellow-400 px-6 py-2 rounded-lg hover:from-amber-700 hover:to-amber-600 hover:shadow-lg transition-all duration-300 font-semibold text-lg"
                    disabled={loading}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
                {error && <div className="text-red-600 text-sm text-center mt-2">{error}</div>}
            </form>
        </div>
    );
};

export default LoginPage;
