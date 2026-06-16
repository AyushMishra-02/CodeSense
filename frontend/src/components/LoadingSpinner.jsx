const LoadingSpinner = ({ message = 'Analyzing your code', subtext = 'This may take a few seconds' }) => {
  return (
    <div className="loading-state" id="loading-spinner">
      <div className="loading-spinner"></div>
      <p className="loading-text">
        {message}<span className="loading-dots"></span>
      </p>
      <p className="loading-subtext">{subtext}</p>
    </div>
  );
};

export default LoadingSpinner;
