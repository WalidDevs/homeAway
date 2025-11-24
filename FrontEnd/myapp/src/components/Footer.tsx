import { Mail, Phone, Facebook, Twitter, Instagram } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-gray-100 text-gray-700 mt-20 border-t">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center text-sm gap-10 md:gap-0">
                    {/* Gauche */}
                    <div className="md:w-1/3">
                        <h3 className="text-base font-semibold mb-3">À propos de HomeAway</h3>
                        <p className="leading-relaxed">
                            HomeAway est une plateforme dédiée à la location entre particuliers, permettant aux
                            locataires de trouver le logement idéal et aux propriétaires de rentabiliser leur bien.
                        </p>
                    </div>

                    {/* Centre */}
                    <div className="md:w-1/3 flex flex-col items-start md:items-center">
                        <h3 className="text-base font-semibold mb-3">Contact</h3>
                        <ul className="space-y-2">
                            <li className="flex items-center gap-2">
                                <Mail size={16} /> support@homeaway.com
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone size={16} /> +33 1 23 45 67 89
                            </li>
                        </ul>
                    </div>

                    {/* Droite */}
                    <div className="md:w-1/3 flex flex-col items-start md:items-end">
                        <h3 className="text-base font-semibold mb-3">Suivez-nous</h3>
                        <div className="flex gap-4">
                            <a className="hover:text-blue-800 transition">
                                <Facebook size={20} />
                            </a>

                            <a  className="hover:text-sky-500 transition">
                                <Twitter size={20} />
                            </a>
                            <a  className="hover:text-pink-500 transition">
                                <Instagram size={20} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-center text-xs text-gray-500 py-4 border-t">
                &copy; {new Date().getFullYear()} HomeAway. Tous droits réservés.
            </div>
        </footer>
    );
};

export default Footer;
