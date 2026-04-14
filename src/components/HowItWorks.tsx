const steps = [
  {
    number: '1',
    title: 'Set Up Your Profile',
    description: 'Upload your resume or enter your background info — industry, role, skills, and career goals.',
  },
  {
    number: '2',
    title: 'Choose Your Question',
    description: 'Select a question type (behavioral, case, or situational) and difficulty level. Optionally paste a job description.',
  },
  {
    number: '3',
    title: 'Answer the Question',
    description: 'Write a free-form response or choose from AI-generated multiple choice options.',
  },
  {
    number: '4',
    title: 'Get AI Feedback',
    description: 'Receive detailed scoring, strengths, improvements, STAR evaluation, and personalized tips.',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="mx-auto max-w-4xl px-4">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          How It Works
        </h2>
        <div className="mt-16 space-y-12">
          {steps.map((step, index) => (
            <div key={step.number} className="flex gap-6 items-start">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-lg font-bold text-white">
                {step.number}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {step.title}
                </h3>
                <p className="mt-1 text-gray-600">{step.description}</p>
                {index < steps.length - 1 && (
                  <div className="ml-[-30px] mt-6 h-6 w-px bg-indigo-200" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
