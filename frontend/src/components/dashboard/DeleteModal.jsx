export default function DeleteModal ({
    show,
    onClose,
    onConfirm,
}) {
    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <div className="w-full max-w-md rounded-2xl bg-[#111827] border border-white/10 p-6 shadow-2xl">
                <h2 className="text-2xl font-bold text-white">
                    Delete URL?
                </h2>

                <p className="mt-3 text-gray-400">
                    This action cannot be undone.
                </p>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white transition"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white transition"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}