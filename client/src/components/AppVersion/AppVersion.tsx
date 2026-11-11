const AppVersion = () => {
    return (
        <span className="absolute bottom-2 text-xs left-1/2 -translate-x-1/2 text-gray-500">
            v{__APP_VERSION__}
        </span>
    );
};

export default AppVersion;
