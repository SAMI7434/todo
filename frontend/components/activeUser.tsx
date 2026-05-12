type ActiveUserProps = {
	name: string;
	status: "online" | "offline";
};

export default function ActiveUser({ name, status }: ActiveUserProps) {
	return (
		<div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-3">
			<div>
				<p className="text-sm font-medium text-slate-100">{name}</p>
				<p className="text-xs text-slate-400">{status}</p>
			</div>
			<span
				className={`h-2.5 w-2.5 rounded-full ${
					status === "online" ? "bg-emerald-400" : "bg-slate-500"
				}`}
				aria-hidden="true"
			/>
		</div>
	);
}
