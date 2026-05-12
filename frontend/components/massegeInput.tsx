"use client";

import { useState } from "react";

type MassegeInputProps = {
	onSend: (value: string) => void;
	disabled?: boolean;
};

export default function MassegeInput({ onSend, disabled }: MassegeInputProps) {
	const [value, setValue] = useState("");

	const handleSend = () => {
		const trimmed = value.trim();
		if (!trimmed) {
			return;
		}

		onSend(trimmed);
		setValue("");
	};

	return (
		<div className="flex items-center gap-3 rounded-3xl border border-slate-800 bg-slate-900/50 p-3">
			<input
				value={value}
				onChange={(event) => setValue(event.target.value)}
				onKeyDown={(event) => {
					if (event.key === "Enter") {
						handleSend();
					}
				}}
				placeholder="Type a message..."
				className="flex-1 bg-transparent px-4 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-500"
				disabled={disabled}
			/>
			<button
				type="button"
				onClick={handleSend}
				disabled={disabled}
				className="rounded-full bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-70"
			>
				Send
			</button>
		</div>
	);
}
