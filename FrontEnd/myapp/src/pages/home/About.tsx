import { Users2Icon, Award, CircleUserIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import HomeNavbar from "../../components/HomeNavbar";
const About = () => {
    const navigate = useNavigate();
    const handleRedirect = () => {
        navigate("/register");
    };
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#E6F4FA] to-white">
            <HomeNavbar onSearch={() => {}} />
            <div className="relative overflow-hidden pt-20 pb-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center space-y-8">
                        <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#0077B6] to-blue-500">
                            À propos de HomeAway
                        </h1>
                        <p className="max-w-2xl mx-auto text-xl text-gray-600 leading-relaxed">
                            Une plateforme qui réinvente la location de logements entre particuliers avec confiance, simplicité et accessibilité.
                        </p>
                    </div>
                </div>
            </div>

            {/* Mission Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="grid md:grid-cols-2 gap-8 items-center p-8 md:p-12">
                        <div className="space-y-6">
                            <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#D0EAF5] text-[#0077B6] font-semibold text-sm">
                                Notre Mission
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900">
                                Créer des connexions authentiques
                            </h2>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                Chez <span className="font-semibold">HomeAway</span>, nous croyons en un monde où chacun peut trouver un logement chaleureux, quel que soit son budget. Nous connectons les propriétaires et les voyageurs pour des expériences authentiques et uniques.
                            </p>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                Plus qu'un site de location, HomeAway est une communauté de confiance basée sur la transparence, la sécurité, et l'humain.
                            </p>
                        </div>
                        <div className="relative h-96 rounded-xl overflow-hidden shadow-2xl">
                            <img
                                src="../../../public/image_1.jpg"
                                alt="Mission HomeAway"
                                className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Values Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Nos valeurs</h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Des principes qui guident chacune de nos actions pour vous offrir la meilleure expérience possible.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: <CircleUserIcon className="w-8 h-8" />,
                            title: "Confiance",
                            description: "Des logements vérifiés, des utilisateurs authentifiés et un support réactif.",
                            gradient: "from-[#0077B6] to-blue-500"
                        },
                        {
                            icon: <Award className="w-8 h-8" />,
                            title: "Accessibilité",
                            description: "Une interface intuitive et des logements pour tous les budgets.",
                            gradient: "from-[#0077B6] to-cyan-500"
                        },
                        {
                            icon: <Users2Icon className="w-8 h-8" />,
                            title: "Communauté",
                            description: "Des liens humains, du partage et des expériences locales.",
                            gradient: "from-[#0077B6] to-sky-500"
                        }
                    ].map((value, idx) => (
                        <div
                            key={idx}
                            className="group relative bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
                            <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${value.gradient} text-white mb-6`}>
                                {value.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                            <p className="text-gray-600">{value.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-[#0077B6] to-blue-500 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-6">
                        Rejoins l'aventure HomeAway
                    </h2>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        Que tu sois propriétaire ou voyageur, HomeAway est là pour t'accompagner dans ton aventure.
                    </p>
                    <button
                        onClick={handleRedirect}
                        className="bg-white text-[#0077B6] px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-50 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                        Créer un compte
                    </button>

                </div>
            </div>
        </div>
    );
};

export default About;
