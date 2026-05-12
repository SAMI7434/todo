"use client";

import type { ReactNode } from "react";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type AuthUser = {
	name: string;
	email: string;
};

type AuthContextValue = {
	user: AuthUser | null;
	isReady: boolean;
	login: (user: AuthUser) => void;
	register: (user: AuthUser) => void;
	logout: () => void;
};

const STORAGE_KEY = "todo_user";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readStoredUser(): AuthUser | null {
	if (typeof window === "undefined") {
		return null;
	}

	try {
		const raw = window.localStorage.getItem(STORAGE_KEY);
		if (!raw) {
			return null;
		}

		return JSON.parse(raw) as AuthUser;
	} catch {
		return null;
	}
}

function writeStoredUser(user: AuthUser | null) {
	if (typeof window === "undefined") {
		return;
	}

	try {
		if (user) {
			window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
		} else {
			window.localStorage.removeItem(STORAGE_KEY);
		}
	} catch {
		// Ignore storage errors (private mode, quota).
	}
}

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<AuthUser | null>(null);
	const [isReady, setIsReady] = useState(false);

	useEffect(() => {
		setUser(readStoredUser());
		setIsReady(true);
	}, []);

	const login = (nextUser: AuthUser) => {
		setUser(nextUser);
		writeStoredUser(nextUser);
	};

	const register = (nextUser: AuthUser) => {
		setUser(nextUser);
		writeStoredUser(nextUser);
	};

	const logout = () => {
		setUser(null);
		writeStoredUser(null);
	};

	const value = useMemo(
		() => ({ user, isReady, login, register, logout }),
		[user, isReady]
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const context = useContext(AuthContext);

	if (!context) {
		throw new Error("useAuth must be used within AuthProvider");
	}

	return context;
}
