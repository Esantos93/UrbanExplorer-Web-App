// FooterView.jsx
import "/src/styles/style.css";

export function FooterView(props) {
    return (
        <footer className="global-px flex items-center pt-8 pb-5 gap-4">
            <span className="font-black tracking-tight">URBAN EXPLORE</span>
            <a className="text-sm" href="https://gits-15.sys.kth.se/iprog-students/cfranze-ebrunius-edsr-puta-HT25-Project">Github</a>

            <div className="ml-auto text-sm">
                <span>DH2642 {props.year}</span>
            </div>
        </footer>
    );
}