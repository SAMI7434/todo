import MassegeBubble from "./massegeBubble";

type ChatUser = {
	name?: string;
};

export type ChatMessage = {
	id: string;
	room?: string;
	text: string;
	user?: ChatUser;
	ts: string;
	system?: boolean;
};

type ChatWindowProps = {
	messages: ChatMessage[];
	currentUserName?: string;
};

export default function ChatWindow({ messages, currentUserName }: ChatWindowProps) {
	return (
		<div className="flex flex-1 flex-col gap-3 overflow-y-auto rounded-3xl border border-slate-800 bg-slate-900/40 p-6">
			{messages.length === 0 ? (
				<p className="text-center text-sm text-slate-500">No messages yet.</p>
			) : (
				messages.map((message) => (
					<MassegeBubble
						key={message.id}
						message={message}
						isOwn={message.user?.name === currentUserName}
					/>
				))
			)}
		</div>
	);
}
