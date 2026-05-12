type ChatUser = {
	name?: string;
};

type ChatMessage = {
	id: string;
	text: string;
	user?: ChatUser;
	ts: string;
	system?: boolean;
};

type MessageBubbleProps = {
	message: ChatMessage;
	isOwn: boolean;
};

export default function MassegeBubble({ message, isOwn }: MessageBubbleProps) {
	if (message.system) {
		return (
			<div className="text-center text-xs text-slate-500">
				{message.text}
			</div>
		);
	}

	return (
		<div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
			<div
				className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
					isOwn
						? "bg-amber-400/20 text-amber-100 border border-amber-400/30"
						: "bg-slate-800 text-slate-100 border border-slate-700"
				}`}
			>
				<p className="text-xs text-slate-400">
					{message.user?.name ?? "Guest"}
				</p>
				<p className="mt-1 whitespace-pre-wrap">{message.text}</p>
			</div>
		</div>
	);
}
